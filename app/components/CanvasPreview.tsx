import {
  Download,
  Grid3X3,
  ImageUp,
  Paintbrush,
  Palette,
  Sparkles,
} from "lucide-react";
import { CANVAS_SIZE } from "@/app/lib/constants";
import { estimatedSizeColor } from "@/app/lib/canvas-utils";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import type { AppMode } from "@/app/lib/types";

const PREVIEW_ICONS: Record<
  AppMode,
  React.ComponentType<{ className?: string }>
> = {
  emoji: Sparkles,
  paint: Paintbrush,
  pixel: Grid3X3,
  pixelate: ImageUp,
  formula: Palette,
};

export function CanvasPreview({ g }: { g: AlbumCoverGenerator }) {
  const sizeColor = estimatedSizeColor(g.estimatedSize);
  const usesPixelGrid = g.appMode === "pixel" || g.appMode === "pixelate";
  const usesBlockPreview = usesPixelGrid || g.appMode === "formula";
  const canDraw = g.appMode === "paint" || g.appMode === "pixel";

  const sizeLabel = usesPixelGrid
    ? `${CANVAS_SIZE}×${CANVAS_SIZE}px · ${g.pixelGridSize}×${g.pixelGridSize} blocks`
    : g.appMode === "formula"
    ? `${CANVAS_SIZE}×${CANVAS_SIZE}px · ${g.formulaBlockSize}px blocks`
    : g.appMode === "paint"
    ? `${CANVAS_SIZE}×${CANVAS_SIZE}px`
    : `${g.width} × ${g.height}px`;

  const PreviewIcon = PREVIEW_ICONS[g.appMode];

  return (
    <main className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <PreviewIcon className="w-5 h-5 text-fuchsia-400" />
          Preview
        </h2>
        <span className="text-sm text-neutral-400">
          {sizeLabel}
          {canDraw && " — draw here"}
        </span>
      </div>
      <div className="flex justify-center items-center bg-[repeating-conic-gradient(#1f1f1f_0_25%,#262626_0_50%)] bg-[length:24px_24px] rounded-lg overflow-hidden">
        <canvas
          ref={g.canvasRef}
          className={`max-w-full h-auto block ${
            canDraw ? "cursor-crosshair touch-none" : ""
          }`}
          style={{
            maxHeight: "min(80vh, 1000px)",
            imageRendering: usesBlockPreview ? "pixelated" : "auto",
          }}
          onPointerDown={(e) => {
            if (!canDraw) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            g.startDrawing(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!g.isDrawingRef.current || !canDraw) return;
            g.continueDrawing(e.clientX, e.clientY);
          }}
          onPointerUp={g.endDrawing}
          onPointerCancel={g.endDrawing}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className={`text-xs ${sizeColor}`}>~{g.sizeMB.toFixed(2)} MB</span>
        <button
          type="button"
          onClick={g.downloadImage}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-md text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </main>
  );
}
