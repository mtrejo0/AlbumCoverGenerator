"use client";

import { useRef } from "react";
import { ImageUp } from "lucide-react";
import { CANVAS_SIZE } from "@/app/lib/constants";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import type { PixelateFit } from "@/app/lib/types";
import {
  ColorField,
  Label,
  Pill,
  Section,
} from "@/app/components/ui/form-controls";

export function PixelateControls({ g }: { g: AlbumCoverGenerator }) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (g.appMode !== "pixelate") return null;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    void g.pixelateFromFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Section title="Pixelate image" icon={<ImageUp className="w-4 h-4" />}>
      <p className="text-xs text-neutral-500">
        Upload a photo — it scales to {CANVAS_SIZE}×{CANVAS_SIZE}px, then maps
        to your {g.pixelGridSize}×{g.pixelGridSize} grid. Switch to Pixel art to
        paint edits by hand.
      </p>
      <ColorField
        label="Letterbox background"
        value={g.paintBackgroundColor}
        onChange={g.setPaintBackgroundColor}
      />
      <div>
        <Label>Fit on canvas</Label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["cover", "Cover (crop)"],
              ["contain", "Contain (letterbox)"],
            ] as const
          ).map(([fit, label]) => (
            <Pill
              key={fit}
              selected={g.pixelateFit === fit}
              onClick={() => g.setPixelateFit(fit as PixelateFit)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={g.isPixelating}
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 transition-colors rounded-md font-medium"
      >
        <ImageUp className="w-4 h-4" />
        {g.isPixelating ? "Processing…" : "Upload image"}
      </button>
      {g.hasPixelSource && (
        <p className="text-xs text-neutral-400">
          Change grid size or fit above to re-sample.
        </p>
      )}
    </Section>
  );
}
