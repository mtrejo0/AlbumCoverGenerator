import { Eraser, Paintbrush } from "lucide-react";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import {
  ColorField,
  RangeField,
  Section,
} from "@/app/components/ui/form-controls";

export function PaintBrushSection({ g }: { g: AlbumCoverGenerator }) {
  if (g.appMode !== "paint") return null;

  return (
    <Section title="Brush" icon={<Paintbrush className="w-4 h-4" />}>
      <ColorField
        label="Background"
        value={g.paintBackgroundColor}
        onChange={g.setPaintBackgroundColor}
      />
      <ColorField
        label="Brush color"
        value={g.brushColor}
        onChange={g.setBrushColor}
      />
      <RangeField
        label={`Brush size: ${g.brushSize}px`}
        value={g.brushSize}
        min={1}
        max={120}
        step={1}
        onChange={g.setBrushSize}
      />
      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={g.eraser}
          onChange={(e) => g.setEraser(e.target.checked)}
          className="w-4 h-4 accent-fuchsia-500"
        />
        <Eraser className="w-4 h-4 text-neutral-400" />
        Eraser
      </label>
      <button
        type="button"
        onClick={g.clearStrokeLayer}
        className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md text-sm font-medium transition-colors"
      >
        Clear drawing
      </button>
    </Section>
  );
}
