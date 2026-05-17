import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import type { ColorMode, GradientDirection, PlacementMode } from "@/app/lib/types";
import {
  ColorField,
  Label,
  NumberField,
  Pill,
  RangeField,
  Section,
} from "@/app/components/ui/form-controls";

const GRADIENT_OPTIONS: { value: GradientDirection; label: string }[] = [
  { value: "diagonal-tl-br", label: "↘ TL → BR" },
  { value: "diagonal-tr-bl", label: "↙ TR → BL" },
  { value: "diagonal-bl-tr", label: "↗ BL → TR" },
  { value: "diagonal-br-tl", label: "↖ BR → TL" },
  { value: "horizontal-lr", label: "→ Left → Right" },
  { value: "horizontal-rl", label: "← Right → Left" },
  { value: "vertical-tb", label: "↓ Top → Bottom" },
  { value: "vertical-bt", label: "↑ Bottom → Top" },
];

export function EmojiControls({ g }: { g: AlbumCoverGenerator }) {
  if (g.appMode !== "emoji") return null;

  const paletteCount = g.emojiList
    .trim()
    .split(/\s+/)
    .filter((e) => e.length > 0).length;

  return (
    <>
      <Section title="Background">
        <div className="flex flex-wrap gap-2 mb-3">
          {(["single", "linear", "radial"] as ColorMode[]).map((m) => (
            <Pill
              key={m}
              selected={g.colorMode === m}
              onClick={() => g.setColorMode(m)}
            >
              {m === "single"
                ? "Solid"
                : m === "linear"
                ? "Linear gradient"
                : "Radial gradient"}
            </Pill>
          ))}
        </div>
        {g.colorMode === "single" && (
          <ColorField
            label="Background"
            value={g.backgroundColor}
            onChange={g.setBackgroundColor}
          />
        )}
        {(g.colorMode === "linear" || g.colorMode === "radial") && (
          <div className="space-y-3">
            <ColorField
              label="Color 1"
              value={g.gradientColor1}
              onChange={g.setGradientColor1}
            />
            <ColorField
              label="Color 2"
              value={g.gradientColor2}
              onChange={g.setGradientColor2}
            />
            {g.colorMode === "linear" && (
              <div>
                <Label>Direction</Label>
                <select
                  value={g.gradientDirection}
                  onChange={(e) =>
                    g.setGradientDirection(e.target.value as GradientDirection)
                  }
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <optgroup label="Diagonal">
                    {GRADIENT_OPTIONS.slice(0, 4).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Horizontal">
                    {GRADIENT_OPTIONS.slice(4, 6).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Vertical">
                    {GRADIENT_OPTIONS.slice(6).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section title="Emojis">
        <div className="flex flex-wrap gap-2 mb-3">
          {(["random", "grid"] as PlacementMode[]).map((m) => (
            <Pill
              key={m}
              selected={g.placementMode === m}
              onClick={() => g.setPlacementMode(m)}
            >
              {m === "random" ? "Random" : "Grid"}
            </Pill>
          ))}
        </div>
        {g.placementMode === "random" ? (
          <RangeField
            label={`Number of emojis: ${g.numEmojis}`}
            value={g.numEmojis}
            min={0}
            max={1000}
            step={10}
            onChange={g.setNumEmojis}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Rows"
              value={g.gridRows}
              min={1}
              max={100}
              onChange={g.setGridRows}
            />
            <NumberField
              label="Columns"
              value={g.gridColumns}
              min={1}
              max={100}
              onChange={g.setGridColumns}
            />
            <p className="col-span-2 text-xs text-neutral-400">
              {g.gridRows * g.gridColumns} emojis in a {g.gridRows}×
              {g.gridColumns} grid.
            </p>
          </div>
        )}
        <RangeField
          label={`Rotation range: ${g.rotationRange}°`}
          value={g.rotationRange}
          min={0}
          max={360}
          step={15}
          onChange={g.setRotationRange}
        />
        <RangeField
          label={`Emoji size: ${
            g.fontSize ?? Math.round(Math.min(g.width, g.height) / 20)
          }px${g.fontSize === null ? " (auto)" : ""}`}
          value={g.fontSize ?? Math.round(Math.min(g.width, g.height) / 20)}
          min={10}
          max={1000}
          step={10}
          onChange={g.setFontSize}
        />
        <button
          type="button"
          onClick={() => g.setFontSize(null)}
          className="text-xs text-fuchsia-400 hover:text-fuchsia-300 underline"
        >
          Reset to auto
        </button>
        <label className="flex items-center gap-2 text-sm text-neutral-300 mt-3">
          <input
            type="checkbox"
            checked={g.randomOpacity}
            onChange={(e) => g.setRandomOpacity(e.target.checked)}
            className="w-4 h-4 accent-fuchsia-500"
          />
          Randomize opacity
        </label>
        <div className="mt-3">
          <Label>
            Emoji palette
            <span className="text-neutral-500 font-normal ml-1">
              ({paletteCount})
            </span>
          </Label>
          <textarea
            value={g.emojiList}
            onChange={(e) => g.setEmojiList(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
      </Section>
    </>
  );
}
