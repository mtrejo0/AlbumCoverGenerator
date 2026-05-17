import { CANVAS_SIZE } from "./constants";
import type { ColorMode, GradientDirection, PlacementMode } from "./types";
import { pixelCellSize } from "./canvas-utils";

export type BackgroundParams = {
  width: number;
  height: number;
  colorMode: ColorMode;
  backgroundColor: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientDirection: GradientDirection;
};

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  p: BackgroundParams
): void {
  const { width, height, colorMode } = p;
  if (colorMode === "single") {
    ctx.fillStyle = p.backgroundColor;
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
    switch (p.gradientDirection) {
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

  gradient.addColorStop(0, p.gradientColor1);
  gradient.addColorStop(1, p.gradientColor2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export type EmojiParams = {
  width: number;
  height: number;
  emojiList: string;
  fontSize: number | null;
  placementMode: PlacementMode;
  numEmojis: number;
  gridRows: number;
  gridColumns: number;
  rotationRange: number;
  randomOpacity: boolean;
};

export function drawEmojis(
  ctx: CanvasRenderingContext2D,
  p: EmojiParams
): void {
  const emojis = p.emojiList
    .trim()
    .split(/\s+/)
    .filter((e) => e.length > 0);
  if (emojis.length === 0) return;

  const emojiFontSize = p.fontSize ?? Math.min(p.width, p.height) / 20;
  ctx.font = `${emojiFontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const renderOne = (emoji: string, x: number, y: number) => {
    const rotation = (Math.random() - 0.5) * p.rotationRange;
    const alpha = p.randomOpacity ? 0.3 + Math.random() * 0.7 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  };

  if (p.placementMode === "random") {
    for (let i = 0; i < p.numEmojis; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      renderOne(emoji, Math.random() * p.width, Math.random() * p.height);
    }
  } else {
    const cellWidth = p.width / p.gridColumns;
    const cellHeight = p.height / p.gridRows;
    for (let row = 0; row < p.gridRows; row++) {
      for (let col = 0; col < p.gridColumns; col++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        renderOne(
          emoji,
          (col + 0.5) * cellWidth,
          (row + 0.5) * cellHeight
        );
      }
    }
  }
}

export type PixelArtParams = {
  pixelGridSize: number;
  pixelCells: string[];
  paintBackgroundColor: string;
};

export function renderPixelArtToCanvas(
  canvas: HTMLCanvasElement,
  p: PixelArtParams
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const cell = pixelCellSize(p.pixelGridSize);
  for (let row = 0; row < p.pixelGridSize; row++) {
    for (let col = 0; col < p.pixelGridSize; col++) {
      ctx.fillStyle =
        p.pixelCells[row * p.pixelGridSize + col] ?? p.paintBackgroundColor;
      ctx.fillRect(col * cell, row * cell, cell, cell);
    }
  }
  return ctx;
}

export type PaintFrameParams = {
  paintBackgroundColor: string;
  strokeLayer: HTMLCanvasElement | null;
};

export function compositePaintFrameToCanvas(
  canvas: HTMLCanvasElement,
  p: PaintFrameParams
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  ctx.fillStyle = p.paintBackgroundColor;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const layer = p.strokeLayer;
  if (layer && layer.width === CANVAS_SIZE && layer.height === CANVAS_SIZE) {
    ctx.drawImage(layer, 0, 0);
  }
  return ctx;
}

export function strokeOnLayer(
  layer: HTMLCanvasElement,
  x: number,
  y: number,
  opts: {
    brushColor: string;
    brushSize: number;
    eraser: boolean;
    fromX?: number;
    fromY?: number;
  }
): void {
  const lctx = layer.getContext("2d");
  if (!lctx) return;
  const size = Math.max(1, opts.brushSize);
  lctx.globalCompositeOperation = opts.eraser
    ? "destination-out"
    : "source-over";
  if (!opts.eraser) {
    lctx.strokeStyle = opts.brushColor;
    lctx.fillStyle = opts.brushColor;
  }
  lctx.lineWidth = size;
  lctx.lineCap = "round";
  lctx.lineJoin = "round";
  if (
    opts.fromX !== undefined &&
    opts.fromY !== undefined &&
    (opts.fromX !== x || opts.fromY !== y)
  ) {
    lctx.beginPath();
    lctx.moveTo(opts.fromX, opts.fromY);
    lctx.lineTo(x, y);
    lctx.stroke();
  } else {
    lctx.beginPath();
    lctx.arc(x, y, size / 2, 0, Math.PI * 2);
    lctx.fill();
  }
  lctx.globalCompositeOperation = "source-over";
}
