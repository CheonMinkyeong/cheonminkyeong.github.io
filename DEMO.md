# Cheon Minkyeong — local demo

Preview: http://localhost:3000/

## Included
- English portfolio with deep charcoal palette and serif typography.
- Real-time Three.js portrait and four artwork planes, deforming silver ribbon, and one introductory light pass.
- Static fallback, reduced-motion support, pause control, capped resolution and frame rate, offscreen/background suspension.
- Four stable work URLs, project filters, and local drag/arrow reordering saved only in this browser.
- Click-to-load YouTube and Spotify embeds; activating another player unmounts the previous player.
- Responsive layouts and page-specific titles and descriptions.

## Demo boundaries
- Nothing is published. Search indexing is disabled intentionally until official text, domain and credits are confirmed.
- The supplied screenshot artwork is used as supplied; its UI tooltip remains. Some covers are low-resolution. Original covers should replace these before publication.
- The fourth artwork title and credits are not known and remain explicitly provisional. It is not assigned to the production album without verification.
- Work pages link to known project channels. Individual recording IDs, release dates, full biography and contact information need confirmation.
- Local order storage is a preview of editing, not a multi-user CMS. Section ordering and a production administration interface are not implemented in this demo.
- Build and TypeScript checks passed. Local page and asset HTTP checks performed. Browser visual QA and external playback were not tested.

## Edit and run
- Work records and default order: app/works-data.ts
- Main page: app/portfolio.tsx
- 3D: app/stage.tsx
- Theme: app/globals.css
- Start: pnpm dev
- Validate: pnpm exec tsc --noEmit && pnpm build
