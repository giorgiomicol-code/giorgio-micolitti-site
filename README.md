# Giorgio Micolitti — Professional Website

New editorial portfolio for Giorgio Micolitti, focused on civil and geotechnical engineering, railway infrastructure, underground works, bridges, project leadership, publications and technical media.

## Current implementation

- React + TypeScript + Vite
- Italian / English interface
- Responsive editorial layout
- Career timeline and expertise areas
- Selected project narratives
- Publications and awards
- YouTube thumbnail-first video loading
- SEO metadata, Person structured data, robots and sitemap
- Reduced-motion accessibility support

## Content source hierarchy

1. Updated LinkedIn CV supplied by Giorgio Micolitti
2. Current professional website content
3. Institutional and public sources

## Asset migration

The first branch uses a small set of legacy Google Sites image references while the local photo/video archive is being mapped. These references are intentionally isolated in `src/App.tsx` and should be replaced by local optimized WebP/AVIF assets once the source archive is available.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
