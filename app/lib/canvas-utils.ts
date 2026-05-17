import { CANVAS_SIZE } from "./constants";

export function createPixelGrid(size: number, fill: string): string[] {
  return Array.from({ length: size * size }, () => fill);
}

export function pixelCellSize(gridSize: number): number {
  return CANVAS_SIZE / gridSize;
}

export function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function estimatedSizeColor(bytes: number): string {
  if (bytes > 20_000_000) return "text-red-500";
  if (bytes > 10_000_000) return "text-amber-500";
  return "text-emerald-500";
}
