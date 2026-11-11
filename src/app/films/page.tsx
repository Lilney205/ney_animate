import Link from "next/link";
import { allFilms } from "@/lib/films";

export default function FilmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">Catalogue</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Discover the library</h1>
        </div>
        <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-3 text-sm text-slate-200">
          <span className="text-sky-300">●</span>
          {allFilms.length} published films
        </div>
      </header>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-3">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Search</label>
          <input
            aria-label="Search films"
            placeholder="Title, genre..."
            className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
          />
        </div>
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-3">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Genre</label>
          <select className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-sky-400">
            <option>All</option>
            <option>Sci-Fi</option>
            <option>Fantasy</option>
            <option>Action</option>
          </select>
        </div>
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-3">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Year</label>
          <select className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-sky-400">
            <option>All</option>
            <option>2027</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-3">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Access</label>
          <select className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-sky-400">
            <option>All</option>
            <option>Free</option>
            <option>Premium</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {allFilms.map((film) => (
          <Link
            key={film.slug}
            href={`/films/${film.slug}`}
            className="group overflow-hidden rounded-[1.6rem] border border-slate-700/80 bg-slate-900/60 transition hover:-translate-y-1 hover:border-sky-400/40"
          >
            <div className="aspect-[4/5] p-4" style={{ background: film.posterStyle }}>
              <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/10 bg-slate-950/15 p-4">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100">
                  <span>{film.access === "free" ? "Free" : "Premium"}</span>
                  <span>{film.year}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-100">{film.genres.join(" • ")}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{film.title}</h2>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
