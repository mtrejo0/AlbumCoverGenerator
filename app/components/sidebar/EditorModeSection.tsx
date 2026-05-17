import { Grid3X3, ImageUp, Paintbrush, Palette, Sparkles } from "lucide-react";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import { Pill, Section } from "@/app/components/ui/form-controls";
import type { AppMode } from "@/app/lib/types";

export function EditorModeSection({ g }: { g: AlbumCoverGenerator }) {
  return (
    <Section title="Editor mode">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["emoji", "Emoji art", Sparkles],
            ["paint", "Paint", Paintbrush],
            ["pixel", "Pixel art", Grid3X3],
            ["pixelate", "Pixelate", ImageUp],
            ["formula", "Colors", Palette],
          ] as const
        ).map(([mode, label, Icon]) => (
          <Pill
            key={mode}
            selected={g.appMode === mode}
            onClick={() => g.switchAppMode(mode as AppMode)}
          >
            <span className="inline-flex items-center gap-1">
              <Icon className="w-3 h-3" />
              {label}
            </span>
          </Pill>
        ))}
      </div>
      {g.appMode === "paint" && (
        <p className="text-xs text-neutral-500">Draw on the preview canvas.</p>
      )}
      {g.appMode === "pixel" && (
        <p className="text-xs text-neutral-500">
          Click blocks to paint. Same color again erases.
        </p>
      )}
      {g.appMode === "pixelate" && (
        <p className="text-xs text-neutral-500">
          Upload an image to convert it to pixel art.
        </p>
      )}
      {g.appMode === "formula" && (
        <p className="text-xs text-neutral-500">
          Static hue grid from x/y formulas (p5/colors).
        </p>
      )}
    </Section>
  );
}
