# Cheon Minkyeong · 千民京

Music portfolio with an interactive 3D introduction, recordings and collaborations.

Website: https://cheonminkyeong.github.io/

## Development

Use Node.js 24 and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Publishing

Commits to main are built and published to GitHub Pages by the Pages workflow.

```sh
pnpm run build:pages
```

The public static output is `dist/client`. The build includes all six work pages, a sitemap and robots.txt. The local development experience and the alternative Sites build remain available.

## Content

- `app/works-data.ts`: release titles, credits, links and default order
- `public/images`: supplied photographs and album artwork
- `app/portfolio.tsx`: page sections
- `app/stage.tsx`: 3D introduction
- `app/globals.css`: visual styling

Arrange works saves a visitor's preferred order in their browser only. To change the default order for everyone, edit `app/works-data.ts`.

The supplied YouTube playlist links are preserved as provided. External playback availability has not been verified.

All supplied photographs, artwork and music belong to their respective rights holders.
