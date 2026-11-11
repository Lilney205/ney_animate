import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@neyanimate.local" },
    update: {},
    create: {
      email: "admin@neyanimate.local",
      name: "NEY Studio Admin",
      role: "ADMIN",
      password: "$2a$12$g4rQbN8vR5Jm3k4yKfFJ2.HzV5Q2XqJ2rG0hW7iKqR0S7VnN1c9W2",
    },
  });

  await prisma.film.upsert({
    where: { slug: "skyline-harbor" },
    update: {},
    create: {
      slug: "skyline-harbor",
      title: "Skyline Harbor",
      synopsis: "A rogue pilot and a fading astronomer race across a broken metropolis to prevent a wave of celestial storms from tearing the city apart.",
      genres: ["Sci-Fi", "Action", "Drama"],
      releaseYear: 2026,
      duration: "1h 54m",
      posterUrl: "/images/poster-skyline.jpg",
      backdropUrl: "/images/backdrop-skyline.jpg",
      status: "PUBLISHED",
      accessType: "FREE",
      trailerVideo: null,
      mainVideoId: "demo-main-video",
      publishedAt: new Date(),
    },
  });

  await prisma.film.upsert({
    where: { slug: "violet-echo" },
    update: {},
    create: {
      slug: "violet-echo",
      title: "Violet Echo",
      synopsis: "In a city built on sound, a deaf composer hears a hidden signal beneath the flood tunnels and discovers a new rhythm for the world.",
      genres: ["Thriller", "Music", "Drama"],
      releaseYear: 2026,
      duration: "1h 41m",
      posterUrl: "/images/poster-violet.jpg",
      backdropUrl: "/images/backdrop-violet.jpg",
      status: "PUBLISHED",
      accessType: "PREMIUM",
      trailerVideo: null,
      mainVideoId: "demo-premium-video",
      publishedAt: new Date(),
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
