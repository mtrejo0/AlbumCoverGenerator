import { CANVAS_SIZE, PIXEL_GRID_PRESETS } from "@/app/lib/constants";
import { pixelCellSize } from "@/app/lib/canvas-utils";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import {
  Label,
  NumberField,
  Pill,
  Section,
} from "@/app/components/ui/form-controls";

export function DimensionsSection({ g }: { g: AlbumCoverGenerator }) {
  const usesPixelGrid =
    g.appMode === "pixel" || g.appMode === "pixelate";
  const title = usesPixelGrid
    ? "Pixel grid"
    : g.appMode === "paint"
    ? "Canvas"
    : "Dimensions";

  return (
    <Section title={title}>
      {usesPixelGrid ? (
        <>
          <p className="text-xs text-neutral-500">
            Export is {CANVAS_SIZE}×{CANVAS_SIZE}px. Each block scales to fill
            the canvas.
          </p>
          <Label>Grid size (square)</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PIXEL_GRID_PRESETS.map((n) => (
              <Pill
                key={n}
                selected={g.pixelGridSize === n}
                onClick={() => g.resizePixelGrid(n)}
              >
                {n}×{n}
              </Pill>
            ))}
          </div>
          <NumberField
            label="Blocks per side"
            value={g.pixelGridSize}
            min={4}
            max={300}
            onChange={g.resizePixelGrid}
          />
          <p className="text-xs text-neutral-400">
            {g.pixelGridSize}×{g.pixelGridSize} blocks · ~
            {Math.round(pixelCellSize(g.pixelGridSize))}px each on export
            {g.pixelGridSize === 16
              ? " (chunky 16×16)"
              : g.pixelGridSize === 100
              ? " (30px blocks)"
              : ""}
          </p>
        </>
      ) : g.appMode === "paint" || g.appMode === "formula" ? (
        <p className="text-sm text-neutral-400">
          Fixed at {CANVAS_SIZE} × {CANVAS_SIZE}px
          {g.appMode === "formula" &&
            ` · block size in Formula colors`}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Width"
            value={g.width}
            min={100}
            max={10000}
            onChange={g.setWidth}
          />
          <NumberField
            label="Height"
            value={g.height}
            min={100}
            max={10000}
            onChange={g.setHeight}
          />
        </div>
      )}
    </Section>
  );
}
