import { NextResponse } from "next/server";
import { authorizeCorePlayback, getCorePublicStreamUrl } from "@/lib/media-core";
import { getFilmBySlug } from "@/lib/films";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const film = getFilmBySlug(resolvedParams.slug);

  if (!film) {
    return NextResponse.json({ error: "Film not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "trailer" ? "trailer" : "feature";
  let coreAssetId: string | undefined;

  try {
    const storedAsset = await prisma.videoAsset.findFirst({
      where: {
        film: { slug: film.slug },
        provider: "NEY_MEDIA_CORE",
        assetType: kind,
      },
      orderBy: { createdAt: "desc" },
      select: { providerVideoId: true },
    });
    const explicitAssetId = kind === "trailer" ? (film.trailerAssetId || film.coreAssetId) : film.coreAssetId;
    const envAssetId = process.env[`FILM_ASSET_${film.id.replace(/-/g, "_")}`];
    coreAssetId = storedAsset?.providerVideoId || explicitAssetId || envAssetId;

    if (!coreAssetId) {
      return NextResponse.json(
        { error: `No ${kind} video is configured for this film.` },
        { status: 404 },
      );
    }

    const { data, setCookieHeader } = await authorizeCorePlayback(coreAssetId);

    const fullPlaylistUrl = getCorePublicStreamUrl(data.playlistUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    };

    if (setCookieHeader) {
      headers["Set-Cookie"] = setCookieHeader;
    }

    return NextResponse.json(
      {
        ok: true,
        assetId: data.assetId,
        playlistUrl: fullPlaylistUrl,
        expiresAt: data.expiresAt,
      },
      { status: 200, headers }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Media authorization failed";
    console.error("Watch authorization error:", errorMessage);

    // Provide a descriptive message to guide the user if the asset has not been uploaded yet
    return NextResponse.json(
      {
        error: "Stream is currently unavailable or still processing.",
        details: errorMessage,
        coreAssetId,
      },
      { status: 503 }
    );
  }
}
