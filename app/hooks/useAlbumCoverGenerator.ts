"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  CANVAS_SIZE,
  DEFAULT_EMOJIS,
  FILE_SIZE_WARN_BYTES,
} from "@/app/lib/constants";
import { randomHex } from "@/app/lib/color";
import {
  createPixelGrid,
  getCanvasPoint,
  pixelCellSize,
} from "@/app/lib/canvas-utils";
import {
  compositePaintFrameToCanvas,
  drawBackground,
  drawEmojis,
  renderPixelArtToCanvas,
  strokeOnLayer,
} from "@/app/lib/draw";
import {
  DEFAULT_FORMULA_PARAMS,
  randomFormulaParams,
  renderFormulaArtToCanvas,
  type FormulaArtParams,
} from "@/app/lib/formula-art";
import {
  loadImageFromFile,
  pixelateImage,
} from "@/app/lib/pixelate-image";
import type {
  AppMode,
  ColorMode,
  GradientDirection,
  ImageFormat,
  PixelateFit,
  PlacementMode,
} from "@/app/lib/types";

export function useAlbumCoverGenerator() {
  const [appMode, setAppMode] = useState<AppMode>("emoji");
  const [width, setWidth] = useState(CANVAS_SIZE);
  const [height, setHeight] = useState(CANVAS_SIZE);

  const [colorMode, setColorMode] = useState<ColorMode>("linear");
  const [backgroundColor, setBackgroundColor] = useState("#111111");
  const [gradientColor1, setGradientColor1] = useState("#ff6b6b");
  const [gradientColor2, setGradientColor2] = useState("#4ecdc4");
  const [gradientDirection, setGradientDirection] =
    useState<GradientDirection>("diagonal-tl-br");

  const [placementMode, setPlacementMode] = useState<PlacementMode>("random");
  const [numEmojis, setNumEmojis] = useState(50);
  const [gridRows, setGridRows] = useState(10);
  const [gridColumns, setGridColumns] = useState(10);
  const [emojiList, setEmojiList] = useState(DEFAULT_EMOJIS);
  const [fontSize, setFontSize] = useState<number | null>(200);
  const [rotationRange, setRotationRange] = useState(0);
  const [randomOpacity, setRandomOpacity] = useState(false);

  const [imageFormat, setImageFormat] = useState<ImageFormat>("jpeg");
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [estimatedSize, setEstimatedSize] = useState(0);

  const [autoRegenerate, setAutoRegenerate] = useState(true);
  const [seed, setSeed] = useState(0);

  const [brushColor, setBrushColor] = useState("#d946ef");
  const [brushSize, setBrushSize] = useState(8);
  const [paintBackgroundColor, setPaintBackgroundColor] = useState("#111111");
  const [eraser, setEraser] = useState(false);
  const [pixelGridSize, setPixelGridSize] = useState(64);
  const [pixelCells, setPixelCells] = useState<string[]>(() =>
    createPixelGrid(64, "#111111")
  );
  const [pixelShuffleDensity, setPixelShuffleDensity] = useState(0.85);
  const [pixelateFit, setPixelateFit] = useState<PixelateFit>("cover");
  const [isPixelating, setIsPixelating] = useState(false);
  const [hasPixelSource, setHasPixelSource] = useState(false);

  const [formulaBlockSize, setFormulaBlockSize] = useState(
    DEFAULT_FORMULA_PARAMS.blockSize
  );
  const [formulaCoeffX, setFormulaCoeffX] = useState(
    DEFAULT_FORMULA_PARAMS.coeffX
  );
  const [formulaCoeffY, setFormulaCoeffY] = useState(
    DEFAULT_FORMULA_PARAMS.coeffY
  );
  const [formulaCoeffX2, setFormulaCoeffX2] = useState(
    DEFAULT_FORMULA_PARAMS.coeffX2
  );
  const [formulaCoeffY2, setFormulaCoeffY2] = useState(
    DEFAULT_FORMULA_PARAMS.coeffY2
  );
  const [formulaCoeffX3, setFormulaCoeffX3] = useState(
    DEFAULT_FORMULA_PARAMS.coeffX3
  );
  const [formulaCoeffY3, setFormulaCoeffY3] = useState(
    DEFAULT_FORMULA_PARAMS.coeffY3
  );
  const [formulaHueLower, setFormulaHueLower] = useState(
    DEFAULT_FORMULA_PARAMS.hueLower
  );
  const [formulaHueUpper, setFormulaHueUpper] = useState(
    DEFAULT_FORMULA_PARAMS.hueUpper
  );
  const [formulaRandomness, setFormulaRandomness] = useState(
    DEFAULT_FORMULA_PARAMS.randomness
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const strokeLayerRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastPixelCellRef = useRef<{ col: number; row: number } | null>(null);

  const updateEstimatedSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const quality = imageFormat === "jpeg" ? jpegQuality : undefined;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const base64Length = dataUrl.length - dataUrl.indexOf(",") - 1;
    setEstimatedSize((base64Length * 3) / 4);
  }, [imageFormat, jpegQuality]);

  const ensureStrokeLayer = useCallback(() => {
    let layer = strokeLayerRef.current;
    if (!layer) {
      layer = document.createElement("canvas");
      strokeLayerRef.current = layer;
    }
    if (layer.width !== CANVAS_SIZE || layer.height !== CANVAS_SIZE) {
      layer.width = CANVAS_SIZE;
      layer.height = CANVAS_SIZE;
      const lctx = layer.getContext("2d");
      if (lctx) lctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    return layer;
  }, []);

  const compositePaintFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    compositePaintFrameToCanvas(canvas, {
      paintBackgroundColor,
      strokeLayer: strokeLayerRef.current,
    });
    updateEstimatedSize();
  }, [paintBackgroundColor, updateEstimatedSize]);

  const renderPixelArt = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPixelArtToCanvas(canvas, {
      pixelGridSize,
      pixelCells,
      paintBackgroundColor,
    });
    updateEstimatedSize();
  }, [pixelGridSize, pixelCells, paintBackgroundColor, updateEstimatedSize]);

  const formulaParams = useCallback(
    (): FormulaArtParams => ({
      blockSize: formulaBlockSize,
      coeffX: formulaCoeffX,
      coeffY: formulaCoeffY,
      coeffX2: formulaCoeffX2,
      coeffY2: formulaCoeffY2,
      coeffX3: formulaCoeffX3,
      coeffY3: formulaCoeffY3,
      hueLower: formulaHueLower,
      hueUpper: formulaHueUpper,
      randomness: formulaRandomness,
    }),
    [
      formulaBlockSize,
      formulaCoeffX,
      formulaCoeffY,
      formulaCoeffX2,
      formulaCoeffY2,
      formulaCoeffX3,
      formulaCoeffY3,
      formulaHueLower,
      formulaHueUpper,
      formulaRandomness,
    ]
  );

  const renderFormulaArt = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.width !== CANVAS_SIZE || canvas.height !== CANVAS_SIZE) {
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
    }
    renderFormulaArtToCanvas(canvas, formulaParams());
    updateEstimatedSize();
  }, [formulaParams, updateEstimatedSize]);

  const clearStrokeLayer = useCallback(() => {
    const layer = ensureStrokeLayer();
    const lctx = layer.getContext("2d");
    if (lctx) lctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    compositePaintFrame();
  }, [ensureStrokeLayer, compositePaintFrame]);

  const clearPixelGrid = useCallback(() => {
    setPixelCells(createPixelGrid(pixelGridSize, paintBackgroundColor));
  }, [pixelGridSize, paintBackgroundColor]);

  const shufflePixelGrid = useCallback(() => {
    const bg = randomHex();
    setPaintBackgroundColor(bg);
    setBrushColor(randomHex());
    setPixelCells(
      Array.from({ length: pixelGridSize * pixelGridSize }, () =>
        Math.random() < pixelShuffleDensity ? randomHex() : bg
      )
    );
  }, [pixelGridSize, pixelShuffleDensity]);

  const shuffleFormula = useCallback(() => {
    const p = randomFormulaParams();
    setFormulaBlockSize(p.blockSize);
    setFormulaCoeffX(p.coeffX);
    setFormulaCoeffY(p.coeffY);
    setFormulaCoeffX2(p.coeffX2);
    setFormulaCoeffY2(p.coeffY2);
    setFormulaCoeffX3(p.coeffX3);
    setFormulaCoeffY3(p.coeffY3);
    setFormulaHueLower(p.hueLower);
    setFormulaHueUpper(p.hueUpper);
    setFormulaRandomness(p.randomness);
  }, []);

  const applyPixelateFromSource = useCallback(
    (img: HTMLImageElement, size: number) => {
      setPixelCells(
        pixelateImage(img, size, pixelateFit, paintBackgroundColor)
      );
    },
    [pixelateFit, paintBackgroundColor]
  );

  const resizePixelGrid = useCallback(
    (size: number) => {
      setPixelGridSize(size);
      if (!sourceImageRef.current) {
        setPixelCells(createPixelGrid(size, paintBackgroundColor));
      }
    },
    [paintBackgroundColor]
  );

  useEffect(() => {
    if (!sourceImageRef.current) return;
    applyPixelateFromSource(sourceImageRef.current, pixelGridSize);
  }, [pixelGridSize, pixelateFit, paintBackgroundColor, applyPixelateFromSource]);

  const pixelateFromFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        window.alert("Please choose an image file (JPEG, PNG, etc.).");
        return;
      }
      setIsPixelating(true);
      try {
        const img = await loadImageFromFile(file);
        sourceImageRef.current = img;
        setHasPixelSource(true);
        applyPixelateFromSource(img, pixelGridSize);
      } catch {
        window.alert("Could not load that image. Try a different file.");
      } finally {
        setIsPixelating(false);
      }
    },
    [pixelGridSize, applyPixelateFromSource]
  );

  useEffect(() => {
    if (!sourceImageRef.current) return;
    applyPixelateFromSource(sourceImageRef.current, pixelGridSize);
  }, [pixelateFit, paintBackgroundColor, applyPixelateFromSource, pixelGridSize]);

  const fillPixelAt = useCallback(
    (x: number, y: number) => {
      const cell = pixelCellSize(pixelGridSize);
      const col = Math.floor(x / cell);
      const row = Math.floor(y / cell);
      if (
        col < 0 ||
        col >= pixelGridSize ||
        row < 0 ||
        row >= pixelGridSize
      ) {
        return;
      }
      if (
        lastPixelCellRef.current?.col === col &&
        lastPixelCellRef.current?.row === row
      ) {
        return;
      }
      lastPixelCellRef.current = { col, row };
      const idx = row * pixelGridSize + col;
      setPixelCells((prev) => {
        const next = [...prev];
        next[idx] =
          prev[idx] === brushColor ? paintBackgroundColor : brushColor;
        return next;
      });
    },
    [pixelGridSize, brushColor, paintBackgroundColor]
  );

  const applyBrushAt = useCallback(
    (x: number, y: number, fromX?: number, fromY?: number) => {
      const layer = ensureStrokeLayer();
      strokeOnLayer(layer, x, y, {
        brushColor,
        brushSize,
        eraser,
        fromX,
        fromY,
      });
      compositePaintFrame();
    },
    [brushColor, brushSize, eraser, ensureStrokeLayer, compositePaintFrame]
  );

  const generateImage = useCallback(() => {
    if (appMode === "pixel" || appMode === "pixelate") {
      renderPixelArt();
      return;
    }
    if (appMode === "paint") {
      compositePaintFrame();
      return;
    }
    if (appMode === "formula") {
      renderFormulaArt();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    drawBackground(ctx, {
      width,
      height,
      colorMode,
      backgroundColor,
      gradientColor1,
      gradientColor2,
      gradientDirection,
    });
    drawEmojis(ctx, {
      width,
      height,
      emojiList,
      fontSize,
      placementMode,
      numEmojis,
      gridRows,
      gridColumns,
      rotationRange,
      randomOpacity,
    });
    updateEstimatedSize();
  }, [
    appMode,
    width,
    height,
    colorMode,
    backgroundColor,
    gradientColor1,
    gradientColor2,
    gradientDirection,
    emojiList,
    fontSize,
    placementMode,
    numEmojis,
    gridRows,
    gridColumns,
    rotationRange,
    randomOpacity,
    updateEstimatedSize,
    compositePaintFrame,
    renderPixelArt,
    renderFormulaArt,
  ]);

  useEffect(() => {
    if (!autoRegenerate || appMode !== "emoji") return;
    const t = setTimeout(generateImage, 200);
    return () => clearTimeout(t);
  }, [autoRegenerate, generateImage, seed, appMode]);

  useEffect(() => {
    if (appMode === "paint") {
      const t = setTimeout(compositePaintFrame, 0);
      return () => clearTimeout(t);
    }
  }, [appMode, paintBackgroundColor, compositePaintFrame]);

  useEffect(() => {
    if (appMode === "pixel" || appMode === "pixelate") {
      const t = setTimeout(renderPixelArt, 0);
      return () => clearTimeout(t);
    }
  }, [appMode, pixelCells, pixelGridSize, paintBackgroundColor, renderPixelArt]);

  useEffect(() => {
    if (appMode !== "formula") return;
    const t = setTimeout(renderFormulaArt, 200);
    return () => clearTimeout(t);
  }, [appMode, renderFormulaArt]);

  useEffect(() => {
    generateImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateEstimatedSize();
  }, [updateEstimatedSize]);

  const switchAppMode = useCallback(
    (mode: AppMode) => {
      strokeLayerRef.current = null;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      setAppMode(mode);
      if (mode === "emoji") {
        setAutoRegenerate(true);
        setWidth(CANVAS_SIZE);
        setHeight(CANVAS_SIZE);
      } else {
        setAutoRegenerate(false);
        setEraser(false);
        setWidth(CANVAS_SIZE);
        setHeight(CANVAS_SIZE);
        strokeLayerRef.current = null;
        if (mode === "pixel") {
          sourceImageRef.current = null;
          setHasPixelSource(false);
          setPixelGridSize(64);
          setPixelCells(createPixelGrid(64, paintBackgroundColor));
        }
        if (mode === "pixelate" && !sourceImageRef.current) {
          setPixelCells(createPixelGrid(pixelGridSize, paintBackgroundColor));
        }
      }
    },
    [paintBackgroundColor, pixelGridSize]
  );

  const startDrawing = useCallback(
    (clientX: number, clientY: number) => {
      if (appMode === "emoji") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getCanvasPoint(canvas, clientX, clientY);
      isDrawingRef.current = true;
      if (appMode === "pixel") {
        lastPixelCellRef.current = null;
        fillPixelAt(x, y);
        return;
      }
      lastPointRef.current = { x, y };
      applyBrushAt(x, y);
    },
    [appMode, fillPixelAt, applyBrushAt]
  );

  const continueDrawing = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawingRef.current || appMode === "emoji") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getCanvasPoint(canvas, clientX, clientY);
      if (appMode === "pixel") {
        fillPixelAt(x, y);
        return;
      }
      const last = lastPointRef.current;
      if (last) applyBrushAt(x, y, last.x, last.y);
      else applyBrushAt(x, y);
      lastPointRef.current = { x, y };
    },
    [appMode, fillPixelAt, applyBrushAt]
  );

  const endDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastPixelCellRef.current = null;
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (estimatedSize > FILE_SIZE_WARN_BYTES) {
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
    const exportW =
      appMode === "emoji" ? width : CANVAS_SIZE;
    const exportH = appMode === "emoji" ? height : CANVAS_SIZE;
    const link = document.createElement("a");
    link.download = `random-album-cover-${exportW}x${exportH}.${ext}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  }, [estimatedSize, imageFormat, jpegQuality, appMode, width, height]);

  const shuffleAll = useCallback(() => {
    if (appMode !== "emoji") return;
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
    setSeed((s) => s + 1);
  }, [appMode]);

  const handleReroll = useCallback(() => {
    if (appMode === "emoji") setSeed((s) => s + 1);
    else if (appMode === "pixel") shufflePixelGrid();
    else if (appMode === "formula") shuffleFormula();
  }, [appMode, shufflePixelGrid, shuffleFormula]);

  const sizeMB = estimatedSize / 1024 / 1024;

  return {
    appMode,
    switchAppMode,
    width,
    setWidth,
    height,
    setHeight,
    colorMode,
    setColorMode,
    backgroundColor,
    setBackgroundColor,
    gradientColor1,
    setGradientColor1,
    gradientColor2,
    setGradientColor2,
    gradientDirection,
    setGradientDirection,
    placementMode,
    setPlacementMode,
    numEmojis,
    setNumEmojis,
    gridRows,
    setGridRows,
    gridColumns,
    setGridColumns,
    emojiList,
    setEmojiList,
    fontSize,
    setFontSize,
    rotationRange,
    setRotationRange,
    randomOpacity,
    setRandomOpacity,
    imageFormat,
    setImageFormat,
    jpegQuality,
    setJpegQuality,
    estimatedSize,
    sizeMB,
    autoRegenerate,
    setAutoRegenerate,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    paintBackgroundColor,
    setPaintBackgroundColor,
    eraser,
    setEraser,
    pixelGridSize,
    pixelCells,
    pixelShuffleDensity,
    setPixelShuffleDensity,
    pixelateFit,
    setPixelateFit,
    isPixelating,
    pixelateFromFile,
    hasPixelSource,
    formulaBlockSize,
    setFormulaBlockSize,
    formulaCoeffX,
    setFormulaCoeffX,
    formulaCoeffY,
    setFormulaCoeffY,
    formulaCoeffX2,
    setFormulaCoeffX2,
    formulaCoeffY2,
    setFormulaCoeffY2,
    formulaCoeffX3,
    setFormulaCoeffX3,
    formulaCoeffY3,
    setFormulaCoeffY3,
    formulaHueLower,
    setFormulaHueLower,
    formulaHueUpper,
    setFormulaHueUpper,
    formulaRandomness,
    setFormulaRandomness,
    canvasRef,
    clearStrokeLayer,
    clearPixelGrid,
    shufflePixelGrid,
    shuffleFormula,
    resizePixelGrid,
    downloadImage,
    shuffleAll,
    handleReroll,
    startDrawing,
    continueDrawing,
    endDrawing,
    isDrawingRef,
  };
}

export type AlbumCoverGenerator = ReturnType<typeof useAlbumCoverGenerator>;
