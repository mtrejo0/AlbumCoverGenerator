# Agent guide: AlbumCoverGenerator

Standalone Next.js app that generates one-of-a-kind album covers from emojis, gradients, and text overlay. Originally ported from `RandomImageGenerator.jsx` in [`new-moisestrejo.com`](../new-moisestrejo.com), then expanded.

Repo: `git@github.com:mtrejo0/AlbumCoverGenerator.git`. Local path: `/Users/moisestrejo/Documents/random-album-cover`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 3** for styling
- **lucide-react** for icons
- No backend, no database — purely client-side `<canvas>` rendering. Deploys statically on Vercel.

## Layout

```
app/
  layout.tsx     # Root layout, Geist fonts, dark-mode metadata
  page.tsx       # The entire generator (single-file client component + UI primitives)
  globals.css    # Tailwind base + dark-by-default theme
  fonts/         # GeistVF.woff, GeistMonoVF.woff
```

Everything user-facing lives in `app/page.tsx`. There are no API routes and no other app subroutes yet.

## How `app/page.tsx` is organized

It's intentionally one file so a reader can follow the full data flow without jumping around. From top to bottom:

1. **Type aliases**: `ColorMode`, `PlacementMode`, `GradientDirection`, `ImageFormat`, `TextPosition`.
2. **Constants**: `DEFAULT_EMOJIS`, `FONT_FAMILIES`, `randomHex()`.
3. **`Home` component** — the page itself. State is grouped by concern:
   - Canvas dimensions
   - Background (solid / linear gradient / radial gradient)
   - Emoji placement (random or grid, rotation, size, opacity, palette)
   - Title / artist text overlay (text, color, size, font, position, bold, shadow)
   - Export (format, JPEG quality, estimated file size)
   - UX (`autoRegenerate`, `seed` counter for forced re-rolls)
4. **Drawing pipeline**, all wrapped in `useCallback`:
   - `drawBackground(ctx)` → `drawEmojis(ctx)` → `drawText(ctx)` → `updateEstimatedSize()`
   - Composed by `generateImage()`.
5. **Effects**:
   - Debounced auto-regenerate (200ms) when `autoRegenerate` is on.
   - One-time mount render so the canvas is never blank.
   - Re-estimate file size when format/quality changes.
6. **Actions**: `downloadImage()`, `shuffleAll()`.
7. **JSX**: sticky 420px sidebar of controls + preview pane with checkered backdrop.
8. **UI primitives** (bottom of file): `Section`, `Label`, `Pill`, `NumberField`, `RangeField`, `TextField`, `ColorField`. Reuse these instead of inlining new form markup.

## Conventions for changes

1. **Keep the single-file shape** unless the file gets unwieldy. New controls should reuse the primitives at the bottom of `page.tsx`. If you add a new primitive, put it next to the existing ones.
2. **All canvas drawing flows through `generateImage`**. Don't draw to the canvas from event handlers directly — push state, let the effect re-render.
3. **Debounce respect**: any new state that should trigger a redraw just needs to land in the dependency chain of `generateImage` (via `drawBackground` / `drawEmojis` / `drawText`). The 200ms debounce in the auto-regenerate effect handles slider/keystroke spam.
4. **Force a re-roll** (without changing settings) by calling `setSeed((s) => s + 1)`. That's how `Re-roll` and `Shuffle Everything` trigger redraws — the seed is in the auto-regenerate effect's deps.
5. **TypeScript is strict**. Prefer the existing type aliases over `string`. New union-shaped settings should get their own type alias and a `Pill` selector.
6. **Tailwind palette**: dark UI. Surfaces are `bg-neutral-900` / `bg-neutral-800` with `border-neutral-700/800`. Primary accent is `fuchsia-500/600`, success is `emerald-500/600`. Don't introduce new accent colors without a reason.
7. **No emojis in code/comments** unless they're part of the rendered content (the default emoji palette is the obvious exception).
8. **File size guard**: downloads above 20MB trigger a `window.confirm`. If you add new export formats, keep that guard wired in.

## Scripts

```bash
npm run dev    # Next dev server (Turbopack). Default port 3000; will pick the next free port if taken.
npm run build  # Production build
npm run start  # Production server
npm run lint   # next/eslint
```

## Deployment

Vercel, connected to the `main` branch of `mtrejo0/AlbumCoverGenerator`. Project is fully static after `next build` — no env vars required. If a deploy fails with "No Next.js version detected", confirm `package.json` was actually committed (the first commit was README-only and hit this).

## This file

`agents.md` is the canonical agent-oriented overview for this repo. Mirrors the convention used in `new-moisestrejo.com`.
