import { CANVAS_SIZE } from "./constants";
import type { PixelateFit } from "./types";

export type { PixelateFit };

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((c) =>
        Math.min(255, Math.max(0, Math.round(c)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Draw image to CANVAS_SIZE square, then sample average color per grid cell. */
export function pixelateImage(
  img: HTMLImageElement,
  gridSize: number,
  fit: PixelateFit,
  backgroundColor: string
): string[] {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  if (fit === "contain") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const scale = Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (CANVAS_SIZE - w) / 2, (CANVAS_SIZE - h) / 2, w, h);
  } else {
    const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (CANVAS_SIZE - w) / 2, (CANVAS_SIZE - h) / 2, w, h);
  }

  const cell = CANVAS_SIZE / gridSize;
  const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const cells: string[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x0 = Math.floor(col * cell);
      const y0 = Math.floor(row * cell);
      const x1 = Math.min(CANVAS_SIZE, Math.floor((col + 1) * cell));
      const y1 = Math.min(CANVAS_SIZE, Math.floor((row + 1) * cell));
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * CANVAS_SIZE + x) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      cells.push(rgbToHex(r / count, g / count, b / count));
    }
  }

  return cells;
}
