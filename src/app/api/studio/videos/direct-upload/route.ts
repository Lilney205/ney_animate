import { NextResponse } from "next/server";
import { z } from "zod";
import { createCoreAsset } from "@/lib/media-core";
import { prisma } from "@/lib/prisma";
import { getFilmBySlug } from "@/lib/films";

const uploadSchema = z.object({
  title: z.string().min(1).max(100),
  filmSlug: z.string().min(2).max(80),
  kind: z.enum(["trailer", "feature"]).default("feature"),
});

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  const configuredAdminKey = process.env.STUDIO_BOOTSTRAP_KEY;

  if (!configuredAdminKey || adminKey !== configuredAdminKey) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = uploadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload request.", details: parsed.error.flatten() }, { status: 400 });
  }

  const film = getFilmBySlug(parsed.data.filmSlug);
  if (!film) {
    return NextResponse.json({ error: "Film not found." }, { status: 404 });
  }

  let createdAssetId: string | undefined;

  try {
    const assetTitle = `${parsed.data.title} (${parsed.data.kind})`;
    const idempotencyKey = `upload-${parsed.data.filmSlug}-${parsed.data.kind}`;
    const coreAsset = await createCoreAsset(assetTitle, idempotencyKey);
    createdAssetId = coreAsset.id;

    await prisma.$transaction(async (transaction) => {
      const databaseFilm = await transaction.film.upsert({
        where: { slug: film.slug },
        update: {},
        create: {
          slug: film.slug,
          title: film.title,
          synopsis: film.synopsis,
          genres: film.genres,
          releaseYear: film.year,
          duration: film.duration,
          status: film.status === "published" ? "PUBLISHED" : "DRAFT",
          accessType: film.access === "premium" ? "PREMIUM" : "FREE",
        },
      });

      await transaction.videoAsset.create({
        data: {
          filmId: databaseFilm.id,
          provider: "NEY_MEDIA_CORE",
          providerVideoId: coreAsset.id,
          assetType: parsed.data.kind,
          processingStatus: "QUEUED",
          uploadedAt: null,
          metadata: {
            title: parsed.data.title,
            filmSlug: film.slug,
            kind: parsed.data.kind,
          },
        },
      });

      await transaction.film.update({
        where: { id: databaseFilm.id },
        data: parsed.data.kind === "trailer"
          ? { trailerVideo: coreAsset.id }
          : { mainVideoId: coreAsset.id },
      });
    });

    const corePublicBase = process.env.NEXT_PUBLIC_MEDIA_CORE_URL || process.env.NEY_MEDIA_CORE_URL || "http://localhost:8080";
    const fullUploadUrl = `${corePublicBase.replace(/\/$/, "")}${coreAsset.uploadUrl}`;

    return NextResponse.json(
      {
        ok: true,
        upload: {
          id: coreAsset.id,
          provider: "ney-media-core",
          uploadUrl: fullUploadUrl,
          relativeUploadUrl: coreAsset.uploadUrl,
          kind: parsed.data.kind,
          filmSlug: parsed.data.filmSlug,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to contact NEY Media Core";
    if (createdAssetId) {
      console.error("Media Core asset created, but film association failed.", { assetId: createdAssetId, message });
      return NextResponse.json(
        { error: "Upload was created but could not be linked to the film. Retry to complete the association.", assetId: createdAssetId },
        { status: 502 },
      );
    }

    console.error("Direct upload creation failed.", message);
    return NextResponse.json({ error: "Failed to initialize upload session in Media Core." }, { status: 502 });
  }
}
