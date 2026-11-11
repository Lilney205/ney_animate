"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFilmBySlug } from "@/lib/films";
import { VideoPlayer } from "@/components/VideoPlayer";
import { use } from "react";

export default function FilmDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const film = getFilmBySlug(resolvedParams.slug);
  const [activeMedia, setActiveMedia] = useState<"feature" | "trailer" | null>(null);

  if (!film) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <Link href="/films" className="mb-6 inline-flex text-sm font-medium text-sky-300">
        ← Back to catalogue
      </Link>

      <article className="overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-900/60 shadow-[0_0_80px_rgba(15,23,42,0.7)]">
        <div className="p-6 md:p-8" style={{ background: film.backdropStyle }}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
            <div
              className="h-72 w-full max-w-xs rounded-[1.5rem] border border-white/10 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.4)]"
              style={{ background: film.posterStyle }}
            >
              <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/10 bg-slate-950/15 p-4">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100">
                  <span>{film.access === "free" ? "Free" : "Premium"}</span>
                  <span>{film.year}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-100">{film.rating}</p>
                  <h1 className="mt-3 text-4xl font-black text-white">{film.title}</h1>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-300">Now streaming</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">{film.title}</h2>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1">{film.year}</span>
                <span className="rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1">{film.duration}</span>
                <span className="rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1">{film.rating}</span>
                {film.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-sky-100">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200">{film.synopsis}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setActiveMedia("feature")}
                  className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch now
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMedia("trailer")}
                  className="rounded-full border border-slate-500 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-300 cursor-pointer"
                >
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Interactive Modal Video Player */}
      {activeMedia && (
        <VideoPlayer
          slug={film.slug}
          title={`${film.title} ${activeMedia === "trailer" ? "(Trailer)" : ""}`}
          kind={activeMedia}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </main>
  );
}
