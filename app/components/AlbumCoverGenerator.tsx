"use client";

import { useAlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import { CanvasPreview } from "./CanvasPreview";
import { ControlsSidebar } from "./sidebar/ControlsSidebar";

function ProductHuntFooter() {
  return (
    <footer className="mt-12 flex justify-center pb-4">
      <a
        href="https://www.producthunt.com/products/random-album-cover-generator?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-random-album-cover-generator"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Random Album Cover Generator - Make album covers from emojis, gradients, and bold text. | Product Hunt"
          width="250"
          height="54"
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1143671&theme=light&t=1778430189589"
        />
      </a>
    </footer>
  );
}

export function AlbumCoverGenerator() {
  const g = useAlbumCoverGenerator();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Random Album Cover
          </h1>
          <p className="text-neutral-400 mt-2">
            Generate album art from emojis, paint, pixel art, or photo pixelation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <ControlsSidebar g={g} />
          <CanvasPreview g={g} />
        </div>

        <ProductHuntFooter />
      </div>
    </div>
  );
}
