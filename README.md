# AlbumCoverGenerator

Generate one-of-a-kind album covers from emojis, gradients, and text. Pure browser canvas, no backend, no AI.

## Links

- **Live site:** https://albumcovergenerator.vercel.app
- **Repo:** https://github.com/mtrejo0/AlbumCoverGenerator
- **Demo video:** https://www.youtube.com/watch?v=bxS-p2YK9Xk

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # Next dev server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # next/eslint
npm run validate:ph  # Validate product-hunt.json against PH limits
```

## Project layout

- `app/page.tsx` — the entire generator (client component, single-file)
- `app/layout.tsx`, `app/globals.css` — root chrome and dark theme
- `product-hunt.json` — Product Hunt launch draft
- `agents.md` — agent-oriented overview of the codebase

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 3, and lucide-react.
