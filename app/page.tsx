"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  RefreshCw,
  Palette,
  Shuffle,
  Sparkles,
  Type,
} from "lucide-react";

type ColorMode = "single" | "linear" | "radial";
type PlacementMode = "random" | "grid";
type GradientDirection =
  | "diagonal-tl-br"
  | "diagonal-tr-bl"
  | "diagonal-bl-tr"
  | "diagonal-br-tl"
  | "horizontal-lr"
  | "horizontal-rl"
  | "vertical-tb"
  | "vertical-bt";
type ImageFormat = "jpeg" | "png";
type TextPosition = "top" | "center" | "bottom";

const DEFAULT_EMOJIS =
  "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾";

const FONT_FAMILIES = [
  { value: "Helvetica, Arial, sans-serif", label: "Helvetica" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia (serif)" },
  { value: "'Courier New', monospace", label: "Courier (mono)" },
  { value: "Impact, 'Arial Black', sans-serif", label: "Impact" },
  { value: "'Comic Sans MS', cursive", label: "Comic Sans" },
];

function randomHex(): string {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

export default function Home() {
  // Canvas dimensions
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(3000);

  // Background
  const [colorMode, setColorMode] = useState<ColorMode>("linear");
  const [backgroundColor, setBackgroundColor] = useState("#111111");
  const [gradientColor1, setGradientColor1] = useState("#ff6b6b");
  const [gradientColor2, setGradientColor2] = useState("#4ecdc4");
  const [gradientDirection, setGradientDirection] =
    useState<GradientDirection>("diagonal-tl-br");

  // Emojis
  const [placementMode, setPlacementMode] = useState<PlacementMode>("random");
  const [numEmojis, setNumEmojis] = useState(50);
  const [gridRows, setGridRows] = useState(10);
  const [gridColumns, setGridColumns] = useState(10);
  const [emojiList, setEmojiList] = useState(DEFAULT_EMOJIS);
  const [fontSize, setFontSize] = useState<number | null>(200);
  const [rotationRange, setRotationRange] = useState(0);
  const [randomOpacity, setRandomOpacity] = useState(false);

  // Title / artist text overlay
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [titleFontSize, setTitleFontSize] = useState(220);
  const [titleFontFamily, setTitleFontFamily] = useState(FONT_FAMILIES[3].value);
  const [titlePosition, setTitlePosition] = useState<TextPosition>("bottom");
  const [titleBold, setTitleBold] = useState(true);
  const [titleShadow, setTitleShadow] = useState(true);

  // Output settings
  const [imageFormat, setImageFormat] = useState<ImageFormat>("jpeg");
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [estimatedSize, setEstimatedSize] = useState(0);

  // UX
  const [autoRegenerate, setAutoRegenerate] = useState(true);
  const [seed, setSeed] = useState(0); // bumped to force regenerate

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateEstimatedSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const quality = imageFormat === "jpeg" ? jpegQuality : undefined;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const base64Length = dataUrl.length - dataUrl.indexOf(",") - 1;
    setEstimatedSize((base64Length * 3) / 4);
  }, [imageFormat, jpegQuality]);

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (colorMode === "single") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      let gradient: CanvasGradient;
      if (colorMode === "radial") {
        const radius = Math.max(width, height) * 0.75;
        gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          radius * 0.05,
          width / 2,
          height / 2,
          radius
        );
      } else {
        switch (gradientDirection) {
          case "diagonal-tl-br":
            gradient = ctx.createLinearGradient(0, 0, width, height);
            break;
          case "diagonal-tr-bl":
            gradient = ctx.createLinearGradient(width, 0, 0, height);
            break;
          case "diagonal-bl-tr":
            gradient = ctx.createLinearGradient(0, height, width, 0);
            break;
          case "diagonal-br-tl":
            gradient = ctx.createLinearGradient(width, height, 0, 0);
            break;
          case "horizontal-lr":
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            break;
          case "horizontal-rl":
            gradient = ctx.createLinearGradient(width, 0, 0, 0);
            break;
          case "vertical-tb":
            gradient = ctx.createLinearGradient(0, 0, 0, height);
            break;
          case "vertical-bt":
            gradient = ctx.createLinearGradient(0, height, 0, 0);
            break;
          default:
            gradient = ctx.createLinearGradient(0, 0, width, height);
        }
      }

      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    [
      colorMode,
      backgroundColor,
      gradientColor1,
      gradientColor2,
      gradientDirection,
      width,
      height,
    ]
  );

  const drawEmojis = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const emojis = emojiList
        .trim()
        .split(/\s+/)
        .filter((e) => e.length > 0);
      if (emojis.length === 0) return;

      const emojiFontSize = fontSize ?? Math.min(width, height) / 20;
      ctx.font = `${emojiFontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const renderOne = (emoji: string, x: number, y: number) => {
        const rotation = (Math.random() - 0.5) * rotationRange;
        const alpha = randomOpacity ? 0.3 + Math.random() * 0.7 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
      };

      if (placementMode === "random") {
        for (let i = 0; i < numEmojis; i++) {
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          renderOne(emoji, Math.random() * width, Math.random() * height);
        }
      } else {
        const cellWidth = width / gridColumns;
        const cellHeight = height / gridRows;
        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridColumns; col++) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            renderOne(
              emoji,
              (col + 0.5) * cellWidth,
              (row + 0.5) * cellHeight
            );
          }
        }
      }
    },
    [
      emojiList,
      fontSize,
      width,
      height,
      placementMode,
      numEmojis,
      gridRows,
      gridColumns,
      rotationRange,
      randomOpacity,
    ]
  );

  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!title && !artist) return;

      const weight = titleBold ? "bold " : "";
      ctx.fillStyle = titleColor;
      ctx.textAlign = "center";

      if (titleShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = titleFontSize * 0.08;
        ctx.shadowOffsetX = titleFontSize * 0.02;
        ctx.shadowOffsetY = titleFontSize * 0.02;
      }

      const padding = Math.max(width, height) * 0.05;
      const artistFontSize = Math.round(titleFontSize * 0.55);
      const lineGap = Math.round(titleFontSize * 0.2);
      const totalHeight =
        (title ? titleFontSize : 0) +
        (artist ? artistFontSize : 0) +
        (title && artist ? lineGap : 0);

      let baseY: number;
      if (titlePosition === "top") {
        baseY = padding + titleFontSize;
      } else if (titlePosition === "center") {
        baseY = height / 2 - totalHeight / 2 + titleFontSize;
      } else {
        baseY = height - padding - (artist ? artistFontSize + lineGap : 0);
      }

      ctx.textBaseline = "alphabetic";

      if (title) {
        ctx.font = `${weight}${titleFontSize}px ${titleFontFamily}`;
        ctx.fillText(title.toUpperCase(), width / 2, baseY);
      }
      if (artist) {
        ctx.font = `${weight}${artistFontSize}px ${titleFontFamily}`;
        const artistY = title ? baseY + lineGap + artistFontSize : baseY;
        ctx.fillText(artist, width / 2, artistY);
      }

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    [
      title,
      artist,
      titleColor,
      titleFontSize,
      titleFontFamily,
      titlePosition,
      titleBold,
      titleShadow,
      width,
      height,
    ]
  );

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    drawBackground(ctx);
    drawEmojis(ctx);
    drawText(ctx);
    updateEstimatedSize();
  }, [width, height, drawBackground, drawEmojis, drawText, updateEstimatedSize]);

  // Debounced regenerate: avoid redrawing on every keystroke / slider tick.
  useEffect(() => {
    if (!autoRegenerate) return;
    const t = setTimeout(generateImage, 200);
    return () => clearTimeout(t);
  }, [autoRegenerate, generateImage, seed]);

  // Always render once on mount even if autoRegenerate is off.
  useEffect(() => {
    generateImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep size estimate in sync when format/quality changes.
  useEffect(() => {
    updateEstimatedSize();
  }, [updateEstimatedSize]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (estimatedSize > 20_000_000) {
      const proceed = window.confirm(
        `Warning: estimated file size is ${(
          estimatedSize /
          1024 /
          1024
        ).toFixed(2)} MB, exceeding the 20MB limit.\n\n` +
          `Consider:\n- Using JPEG\n- Reducing JPEG quality\n- Reducing dimensions\n\nProceed anyway?`
      );
      if (!proceed) return;
    }

    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const quality = imageFormat === "jpeg" ? jpegQuality : undefined;
    const ext = imageFormat === "jpeg" ? "jpg" : "png";
    const slug = (title || "random-album-cover")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "random-album-cover";

    const link = document.createElement("a");
    link.download = `${slug}-${width}x${height}.${ext}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  };

  const shuffleAll = () => {
    const modes: ColorMode[] = ["single", "linear", "radial"];
    const directions: GradientDirection[] = [
      "diagonal-tl-br",
      "diagonal-tr-bl",
      "diagonal-bl-tr",
      "diagonal-br-tl",
      "horizontal-lr",
      "vertical-tb",
    ];
    const placements: PlacementMode[] = ["random", "grid"];
    const positions: TextPosition[] = ["top", "center", "bottom"];

    setColorMode(modes[Math.floor(Math.random() * modes.length)]);
    setBackgroundColor(randomHex());
    setGradientColor1(randomHex());
    setGradientColor2(randomHex());
    setGradientDirection(
      directions[Math.floor(Math.random() * directions.length)]
    );
    setPlacementMode(placements[Math.floor(Math.random() * placements.length)]);
    setNumEmojis(20 + Math.floor(Math.random() * 200));
    setGridRows(4 + Math.floor(Math.random() * 12));
    setGridColumns(4 + Math.floor(Math.random() * 12));
    setRotationRange(Math.floor(Math.random() * 5) * 90);
    setFontSize(100 + Math.floor(Math.random() * 300));
    setRandomOpacity(Math.random() < 0.5);
    setTitleColor(randomHex());
    setTitlePosition(positions[Math.floor(Math.random() * positions.length)]);
    setSeed((s) => s + 1);
  };

  const sizeMB = estimatedSize / 1024 / 1024;
  const sizeColor =
    estimatedSize > 20_000_000
      ? "text-red-500"
      : estimatedSize > 10_000_000
      ? "text-amber-500"
      : "text-emerald-500";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Random Album Cover
          </h1>
          <p className="text-neutral-400 mt-2">
            Generate one-of-a-kind album art from emojis, gradients, and text.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* Controls */}
          <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-6 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="space-y-2">
              <button
                onClick={shuffleAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors rounded-md font-medium"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle Everything
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSeed((s) => s + 1)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors rounded-md text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Re-roll
                </button>
                <button
                  onClick={downloadImage}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-md text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <label className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                <input
                  type="checkbox"
                  checked={autoRegenerate}
                  onChange={(e) => setAutoRegenerate(e.target.checked)}
                  className="w-4 h-4 accent-fuchsia-500"
                />
                Auto-regenerate on changes
              </label>
            </div>

            <Section title="Dimensions">
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Width"
                  value={width}
                  min={100}
                  max={10000}
                  onChange={setWidth}
                />
                <NumberField
                  label="Height"
                  value={height}
                  min={100}
                  max={10000}
                  onChange={setHeight}
                />
              </div>
            </Section>

            <Section title="Background">
              <div className="flex flex-wrap gap-2 mb-3">
                {(["single", "linear", "radial"] as ColorMode[]).map((m) => (
                  <Pill
                    key={m}
                    selected={colorMode === m}
                    onClick={() => setColorMode(m)}
                  >
                    {m === "single"
                      ? "Solid"
                      : m === "linear"
                      ? "Linear gradient"
                      : "Radial gradient"}
                  </Pill>
                ))}
              </div>

              {colorMode === "single" && (
                <ColorField
                  label="Background"
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                />
              )}
              {(colorMode === "linear" || colorMode === "radial") && (
                <div className="space-y-3">
                  <ColorField
                    label="Color 1"
                    value={gradientColor1}
                    onChange={setGradientColor1}
                  />
                  <ColorField
                    label="Color 2"
                    value={gradientColor2}
                    onChange={setGradientColor2}
                  />
                  {colorMode === "linear" && (
                    <div>
                      <Label>Direction</Label>
                      <select
                        value={gradientDirection}
                        onChange={(e) =>
                          setGradientDirection(
                            e.target.value as GradientDirection
                          )
                        }
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      >
                        <optgroup label="Diagonal">
                          <option value="diagonal-tl-br">↘ TL → BR</option>
                          <option value="diagonal-tr-bl">↙ TR → BL</option>
                          <option value="diagonal-bl-tr">↗ BL → TR</option>
                          <option value="diagonal-br-tl">↖ BR → TL</option>
                        </optgroup>
                        <optgroup label="Horizontal">
                          <option value="horizontal-lr">→ Left → Right</option>
                          <option value="horizontal-rl">← Right → Left</option>
                        </optgroup>
                        <optgroup label="Vertical">
                          <option value="vertical-tb">↓ Top → Bottom</option>
                          <option value="vertical-bt">↑ Bottom → Top</option>
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
                    selected={placementMode === m}
                    onClick={() => setPlacementMode(m)}
                  >
                    {m === "random" ? "Random" : "Grid"}
                  </Pill>
                ))}
              </div>

              {placementMode === "random" ? (
                <RangeField
                  label={`Number of emojis: ${numEmojis}`}
                  value={numEmojis}
                  min={0}
                  max={1000}
                  step={10}
                  onChange={setNumEmojis}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Rows"
                    value={gridRows}
                    min={1}
                    max={100}
                    onChange={setGridRows}
                  />
                  <NumberField
                    label="Columns"
                    value={gridColumns}
                    min={1}
                    max={100}
                    onChange={setGridColumns}
                  />
                  <p className="col-span-2 text-xs text-neutral-400">
                    {gridRows * gridColumns} emojis in a {gridRows}×
                    {gridColumns} grid.
                  </p>
                </div>
              )}

              <RangeField
                label={`Rotation range: ${rotationRange}°`}
                value={rotationRange}
                min={0}
                max={360}
                step={15}
                onChange={setRotationRange}
              />
              <RangeField
                label={`Emoji size: ${
                  fontSize ?? Math.round(Math.min(width, height) / 20)
                }px${fontSize === null ? " (auto)" : ""}`}
                value={fontSize ?? Math.round(Math.min(width, height) / 20)}
                min={10}
                max={1000}
                step={10}
                onChange={setFontSize}
              />
              <button
                onClick={() => setFontSize(null)}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 underline"
              >
                Reset to auto
              </button>

              <label className="flex items-center gap-2 text-sm text-neutral-300 mt-3">
                <input
                  type="checkbox"
                  checked={randomOpacity}
                  onChange={(e) => setRandomOpacity(e.target.checked)}
                  className="w-4 h-4 accent-fuchsia-500"
                />
                Randomize opacity
              </label>

              <div className="mt-3">
                <Label>
                  Emoji palette
                  <span className="text-neutral-500 font-normal ml-1">
                    (
                    {
                      emojiList
                        .trim()
                        .split(/\s+/)
                        .filter((e) => e.length > 0).length
                    }
                    )
                  </span>
                </Label>
                <textarea
                  value={emojiList}
                  onChange={(e) => setEmojiList(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
            </Section>

            <Section title="Title text" icon={<Type className="w-4 h-4" />}>
              <TextField
                label="Title"
                value={title}
                placeholder="ALBUM TITLE"
                onChange={setTitle}
              />
              <TextField
                label="Artist"
                value={artist}
                placeholder="Artist Name"
                onChange={setArtist}
              />
              <ColorField
                label="Text color"
                value={titleColor}
                onChange={setTitleColor}
              />
              <RangeField
                label={`Title size: ${titleFontSize}px`}
                value={titleFontSize}
                min={20}
                max={600}
                step={10}
                onChange={setTitleFontSize}
              />
              <div>
                <Label>Font family</Label>
                <select
                  value={titleFontFamily}
                  onChange={(e) => setTitleFontFamily(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["top", "center", "bottom"] as TextPosition[]).map((p) => (
                  <Pill
                    key={p}
                    selected={titlePosition === p}
                    onClick={() => setTitlePosition(p)}
                  >
                    {p}
                  </Pill>
                ))}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={titleBold}
                    onChange={(e) => setTitleBold(e.target.checked)}
                    className="w-4 h-4 accent-fuchsia-500"
                  />
                  Bold
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={titleShadow}
                    onChange={(e) => setTitleShadow(e.target.checked)}
                    className="w-4 h-4 accent-fuchsia-500"
                  />
                  Drop shadow
                </label>
              </div>
            </Section>

            <Section title="Export">
              <div>
                <Label>Format</Label>
                <select
                  value={imageFormat}
                  onChange={(e) =>
                    setImageFormat(e.target.value as ImageFormat)
                  }
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="jpeg">JPEG (smaller)</option>
                  <option value="png">PNG (larger)</option>
                </select>
              </div>
              {imageFormat === "jpeg" && (
                <RangeField
                  label={`JPEG quality: ${Math.round(jpegQuality * 100)}%`}
                  value={jpegQuality}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onChange={setJpegQuality}
                />
              )}
              <div className="flex items-center justify-between text-sm bg-neutral-800/60 rounded-md px-3 py-2">
                <span className="text-neutral-400">Estimated size</span>
                <span className={`font-semibold ${sizeColor}`}>
                  {sizeMB.toFixed(2)} MB
                </span>
              </div>
              {estimatedSize > 20_000_000 && (
                <p className="text-xs text-red-400">
                  Exceeds 20MB. Try JPEG or smaller dimensions.
                </p>
              )}
            </Section>
          </aside>

          {/* Preview */}
          <main className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
                Preview
              </h2>
              <span className="text-sm text-neutral-400">
                {width} × {height}px
              </span>
            </div>
            <div className="flex justify-center items-center bg-[repeating-conic-gradient(#1f1f1f_0_25%,#262626_0_50%)] bg-[length:24px_24px] rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block"
                style={{ maxHeight: "min(80vh, 1000px)" }}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs ${sizeColor}`}>
                ~{sizeMB.toFixed(2)} MB
              </span>
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-md text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </main>
        </div>

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
      </div>
    </div>
  );
}

/* ---------- small UI primitives ---------- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-neutral-400 mb-1">
      {children}
    </label>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
        selected
          ? "bg-fuchsia-600 text-white"
          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-fuchsia-500"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>
        <span className="inline-flex items-center gap-1">
          <Palette className="w-3 h-3" />
          {label}
        </span>
      </Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <button
          onClick={() => onChange(randomHex())}
          className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md text-xs font-medium"
        >
          Random
        </button>
      </div>
    </div>
  );
}
