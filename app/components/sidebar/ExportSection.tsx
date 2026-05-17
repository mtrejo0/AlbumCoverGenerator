import { FILE_SIZE_WARN_BYTES } from "@/app/lib/constants";
import { estimatedSizeColor } from "@/app/lib/canvas-utils";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import type { ImageFormat } from "@/app/lib/types";
import { Label, RangeField, Section } from "@/app/components/ui/form-controls";

export function ExportSection({ g }: { g: AlbumCoverGenerator }) {
  const sizeColor = estimatedSizeColor(g.estimatedSize);

  return (
    <Section title="Export">
      <div>
        <Label>Format</Label>
        <select
          value={g.imageFormat}
          onChange={(e) => g.setImageFormat(e.target.value as ImageFormat)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        >
          <option value="jpeg">JPEG (smaller)</option>
          <option value="png">PNG (larger)</option>
        </select>
      </div>
      {g.imageFormat === "jpeg" && (
        <RangeField
          label={`JPEG quality: ${Math.round(g.jpegQuality * 100)}%`}
          value={g.jpegQuality}
          min={0.1}
          max={1}
          step={0.05}
          onChange={g.setJpegQuality}
        />
      )}
      <div className="flex items-center justify-between text-sm bg-neutral-800/60 rounded-md px-3 py-2">
        <span className="text-neutral-400">Estimated size</span>
        <span className={`font-semibold ${sizeColor}`}>
          {g.sizeMB.toFixed(2)} MB
        </span>
      </div>
      {g.estimatedSize > FILE_SIZE_WARN_BYTES && (
        <p className="text-xs text-red-400">
          Exceeds 20MB. Try JPEG or smaller dimensions.
        </p>
      )}
    </Section>
  );
}
