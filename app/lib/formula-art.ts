/** Params for the hue formula (ported from Documents/p5/colors/sketch.js). */
export type FormulaArtParams = {
  blockSize: number;
  coeffX: number;
  coeffY: number;
  coeffX2: number;
  coeffY2: number;
  coeffX3: number;
  coeffY3: number;
  hueLower: number;
  hueUpper: number;
  randomness: number;
};

export const DEFAULT_FORMULA_PARAMS: FormulaArtParams = {
  blockSize: 20,
  coeffX: 1,
  coeffY: 1,
  coeffX2: 0,
  coeffY2: 0,
  coeffX3: 0,
  coeffY3: 0,
  hueLower: 0,
  hueUpper: 255,
  randomness: 0,
};

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomFormulaParams(): FormulaArtParams {
  const hueLower = randInt(0, 255);
  return {
    blockSize: randInt(10, 150),
    coeffX: randInt(0, 100),
    coeffY: randInt(0, 100),
    coeffX2: randInt(0, 100),
    coeffY2: randInt(0, 100),
    coeffX3: Math.round(Math.random() * 100) / 100,
    coeffY3: Math.round(Math.random() * 100) / 100,
    hueLower,
    hueUpper: randInt(hueLower, 255),
    randomness: randInt(0, 255),
  };
}

function mapHue(value: number, lower: number, upper: number): number {
  const clamped = Math.max(0, Math.min(255, value));
  return lower + ((upper - lower) * clamped) / 255;
}

export function computeCellHue(
  x: number,
  y: number,
  frameCount: number,
  p: FormulaArtParams
): number {
  const hueValue =
    (p.randomness * Math.random() +
      10 * frameCount +
      x * p.coeffX +
      y * p.coeffY +
      x * x * p.coeffX2 +
      y * y * p.coeffY2 +
      x * x * x * p.coeffX3 +
      y * y * y * p.coeffY3) %
    255;
  return mapHue(hueValue, p.hueLower, p.hueUpper);
}

const FORMULA_FRAME = 0;

export function renderFormulaArtToCanvas(
  canvas: HTMLCanvasElement,
  params: FormulaArtParams
): void {
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { blockSize } = params;

  for (let x = 0; x < size; x += blockSize) {
    for (let y = 0; y < size; y += blockSize) {
      const hue = computeCellHue(x, y, FORMULA_FRAME, params);
      ctx.fillStyle = `hsl(${(hue / 255) * 360}, 100%, 50%)`;
      ctx.fillRect(
        x,
        y,
        Math.min(blockSize, size - x),
        Math.min(blockSize, size - y)
      );
    }
  }
}
