import { NextResponse } from "next/server";
import { z } from "zod";
import { allFilms } from "@/lib/films";

const querySchema = z.object({
  q: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  year: z.string().trim().optional(),
  access: z.enum(["free", "premium", "all"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const { q, genre, year, access = "all", page = "1", limit = "12" } = parsed.data;
  const normalizedPage = Number(page) || 1;
  const normalizedLimit = Number(limit) || 12;

  let items = [...allFilms];

  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (film) => film.title.toLowerCase().includes(needle) || film.synopsis.toLowerCase().includes(needle),
    );
  }

  if (genre) {
    items = items.filter((film) => film.genres.some((entry) => entry.toLowerCase() === genre.toLowerCase()));
  }

  if (year) {
    items = items.filter((film) => String(film.year) === year);
  }

  if (access !== "all") {
    items = items.filter((film) => film.access === access);
  }

  const total = items.length;
  const start = (normalizedPage - 1) * normalizedLimit;
  const paginated = items.slice(start, start + normalizedLimit);

  return NextResponse.json(
    {
      items: paginated,
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      filters: { q: q ?? null, genre: genre ?? null, year: year ?? null, access },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
