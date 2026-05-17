import { Palette, Shuffle } from "lucide-react";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import {
  ColorField,
  RangeField,
  Section,
} from "@/app/components/ui/form-controls";
export function PixelControls({ g }: { g: AlbumCoverGenerator }) {
  if (g.appMode !== "pixel") return null;

  return (
    <>
      <Section title="Block color" icon={<Palette className="w-4 h-4" />}>
        <p className="text-xs text-neutral-500">
          Pick a color, then click or drag on the preview to fill blocks.
        </p>
        <ColorField
          label="Background (empty blocks)"
          value={g.paintBackgroundColor}
          onChange={g.setPaintBackgroundColor}
        />
        <ColorField
          label="Block color"
          value={g.brushColor}
          onChange={g.setBrushColor}
        />
        <button
          type="button"
          onClick={g.clearPixelGrid}
          className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md text-sm font-medium transition-colors"
        >
          Reset all blocks to background
        </button>
      </Section>

      <Section title="Shuffle" icon={<Shuffle className="w-4 h-4" />}>
        <RangeField
          label={`Color density: ${Math.round(g.pixelShuffleDensity * 100)}%`}
          value={g.pixelShuffleDensity}
          min={0.1}
          max={1}
          step={0.05}
          onChange={g.setPixelShuffleDensity}
        />
        <button
          type="button"
          onClick={g.shufflePixelGrid}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors rounded-md font-medium"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle block colors
        </button>
        <p className="text-xs text-neutral-500">
          Randomizes block colors and picks a new background and block color.
        </p>
      </Section>
    </>
  );
}
