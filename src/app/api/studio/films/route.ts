import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  synopsis: z.string().min(12).max(2000),
  genres: z.array(z.string().min(2)).min(1),
  year: z.number().int().min(1900).max(2100),
  duration: z.string().min(3).max(20),
  access: z.enum(["free", "premium"]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");

  if (adminKey !== process.env.STUDIO_BOOTSTRAP_KEY) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json();
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid film payload.", details: parsed.error.flatten() }, { status: 400 });
  }

  const film = {
    id: `film-${Date.now()}`,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, film }, { status: 201 });
}
