export type FilmAccess = "free" | "premium";

export type Film = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  genres: string[];
  year: number;
  duration: string;
  rating: string;
  access: FilmAccess;
  status: "published" | "draft";
  featured?: boolean;
  trailer?: string | null;
  coreAssetId?: string;
  trailerAssetId?: string;
  posterStyle: string;
  backdropStyle: string;
  accent: string;
};

export const films: Film[] = [
  {
    id: "film-01",
    slug: "skyline-harbor",
    title: "Skyline Harbor",
    synopsis:
      "A rogue pilot and a fading astronomer race across a broken metropolis to prevent a wave of celestial storms from tearing the city apart.",
    genres: ["Sci-Fi", "Action", "Drama"],
    year: 2026,
    duration: "1h 54m",
    rating: "PG-13",
    access: "free",
    status: "published",
    featured: true,
    trailer: "The city is still breathing.",
    posterStyle:
      "linear-gradient(135deg, rgba(30,64,175,0.9), rgba(15,23,42,0.2)), linear-gradient(120deg, #0f172a 0%, #1d4ed8 55%, #67e8f9 100%)",
    backdropStyle:
      "radial-gradient(circle at top, rgba(59,130,246,0.32), transparent 40%), linear-gradient(135deg, #020817 0%, #0f172a 35%, #172554 100%)",
    accent: "#5cc8ff",
  },
  {
    id: "film-02",
    slug: "ember-crown",
    title: "Ember Crown",
    synopsis:
      "A hidden prince must unite rival clans beneath a kingdom of constant eclipse before the sacred forge falls silent forever.",
    genres: ["Fantasy", "Adventure"],
    year: 2025,
    duration: "2h 06m",
    rating: "PG",
    access: "free",
    status: "published",
    trailer: "The throne remembers every oath.",
    posterStyle:
      "linear-gradient(135deg, rgba(120,53,15,0.9), rgba(15,23,42,0.2)), linear-gradient(135deg, #1c1917 0%, #7c2d12 40%, #f59e0b 100%)",
    backdropStyle:
      "radial-gradient(circle at center, rgba(249,115,22,0.24), transparent 35%), linear-gradient(135deg, #0b1020 0%, #1c1917 50%, #7c2d12 100%)",
    accent: "#f59e0b",
  },
  {
    id: "film-03",
    slug: "violet-echo",
    title: "Violet Echo",
    synopsis:
      "In a city built on sound, a deaf composer hears a hidden signal beneath the flood tunnels and discovers a new rhythm for the world.",
    genres: ["Thriller", "Music", "Drama"],
    year: 2026,
    duration: "1h 41m",
    rating: "TV-14",
    access: "premium",
    status: "published",
    featured: true,
    trailer: "The city hums when no one is listening.",
    posterStyle:
      "linear-gradient(135deg, rgba(88,28,135,0.9), rgba(15,23,42,0.2)), linear-gradient(135deg, #0f172a 0%, #3b0764 50%, #a78bfa 100%)",
    backdropStyle:
      "radial-gradient(circle at top, rgba(168,85,247,0.26), transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%)",
    accent: "#a78bfa",
  },
  {
    id: "film-04",
    slug: "signal-dusk",
    title: "Signal Dusk",
    synopsis:
      "An archivist and a salvage runner dig through a buried fiber network to recover the final transmission from the last human colony.",
    genres: ["Sci-Fi", "Mystery"],
    year: 2024,
    duration: "1h 38m",
    rating: "PG-13",
    access: "free",
    status: "published",
    trailer: "Every signal hides a memory.",
    posterStyle:
      "linear-gradient(135deg, rgba(10,92,100,0.9), rgba(15,23,42,0.2)), linear-gradient(135deg, #082f49 0%, #0f766e 50%, #67e8f9 100%)",
    backdropStyle:
      "radial-gradient(circle at top, rgba(34,211,238,0.22), transparent 36%), linear-gradient(135deg, #020b14 0%, #082f49 45%, #115e59 100%)",
    accent: "#22d3ee",
  },
  {
    id: "film-05",
    slug: "midnight-umbrella",
    title: "Midnight Umbrella",
    synopsis:
      "Two teenagers uncover a hidden rooftop garden beneath the city’s storm drains and discover the seed of a future civilization.",
    genres: ["Slice of Life", "Adventure"],
    year: 2023,
    duration: "1h 26m",
    rating: "G",
    access: "free",
    status: "published",
    trailer: "Dreams don’t need daylight to grow.",
    posterStyle:
      "linear-gradient(135deg, rgba(30,41,59,0.85), rgba(15,23,42,0.1)), linear-gradient(135deg, #111827 0%, #334155 50%, #2dd4bf 100%)",
    backdropStyle:
      "radial-gradient(circle at top, rgba(45,212,191,0.2), transparent 35%), linear-gradient(135deg, #020817 0%, #0f172a 55%, #164e63 100%)",
    accent: "#2dd4bf",
  },
  {
    id: "film-06",
    slug: "glass-redemption",
    title: "Glass Redemption",
    synopsis:
      "A disgraced artisan is forced to rebuild a shattered moon relay while an old enemy gathers the last surviving prototypes.",
    genres: ["Action", "Drama", "Sci-Fi"],
    year: 2027,
    duration: "2h 18m",
    rating: "PG-13",
    access: "premium",
    status: "published",
    trailer: "Rebuild the sky. Rewrite the future.",
    posterStyle:
      "linear-gradient(135deg, rgba(127,29,29,0.88), rgba(15,23,42,0.18)), linear-gradient(135deg, #0f172a 0%, #7f1d1d 42%, #fca5a5 100%)",
    backdropStyle:
      "radial-gradient(circle at top, rgba(239,68,68,0.24), transparent 38%), linear-gradient(135deg, #111827 0%, #450a0a 45%, #1f2937 100%)",
    accent: "#f87171",
  },
];

export const featuredFilms = films.filter((film) => film.featured);
export const allFilms = films;

export function getFilmBySlug(slug: string) {
  return films.find((film) => film.slug === slug);
}
