import { NextResponse } from "next/server";
import { getFilmBySlug } from "@/lib/films";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const film = getFilmBySlug(slug);

  if (!film) {
    return NextResponse.json({ error: "Film not found." }, { status: 404 });
  }

  return NextResponse.json({ film }, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
