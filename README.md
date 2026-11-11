This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## NEY Media Core

Configure the Media Core connection in `.env.local` (or your deployment's environment variables):

- `NEY_MEDIA_CORE_URL`: Media Core API base URL used by server-side requests. It defaults to `http://localhost:8080`.
- `NEY_MEDIA_CORE_SERVICE_KEY`: tenant service key sent to Media Core; keep it server-side and never expose it in browser code.
- `NEXT_PUBLIC_MEDIA_CORE_URL`: public Media Core base URL used to construct upload and playback URLs accessible by the browser. It defaults to `NEY_MEDIA_CORE_URL`.
- `STUDIO_BOOTSTRAP_KEY`: key required by studio API routes in the `x-admin-key` request header.

The studio endpoint `POST /api/studio/videos/direct-upload` accepts JSON with `title`, `filmSlug`, and optional `kind` (`trailer` or `feature`). It creates an asset in Media Core, saves the asset against the film in the database, and responds with its ID, an upload URL, and the relative upload URL. The film must exist in the app's film catalogue. The endpoint initializes the upload session; the video file itself must then be uploaded to the returned URL using the Media Core upload contract.

For example, initialize an upload with:

```sh
curl -X POST http://localhost:3000/api/studio/videos/direct-upload \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $STUDIO_BOOTSTRAP_KEY" \
  -d '{"title":"Skyline Harbor","filmSlug":"skyline-harbor","kind":"feature"}'
```

Playback is requested through `POST /api/media/{slug}/watch?kind=feature` or `?kind=trailer`. The route uses the latest matching Media Core asset saved for the film, then falls back to an explicit asset ID on the film or its `FILM_ASSET_*` environment variable. Database-backed uploads therefore do not need manual asset-ID configuration. Ensure the Prisma database is configured and its schema has been applied before using uploads.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
