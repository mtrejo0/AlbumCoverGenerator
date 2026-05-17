import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import { DimensionsSection } from "./DimensionsSection";
import { EditorModeSection } from "./EditorModeSection";
import { EmojiControls } from "./EmojiControls";
import { ExportSection } from "./ExportSection";
import { PaintBrushSection } from "./PaintBrushSection";
import { PixelControls } from "./PixelControls";
import { PixelateControls } from "./PixelateControls";
import { FormulaControls } from "./FormulaControls";
import { QuickActions } from "./QuickActions";
export function ControlsSidebar({ g }: { g: AlbumCoverGenerator }) {
  return (
    <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-6 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <EditorModeSection g={g} />
      <QuickActions g={g} />
      <DimensionsSection g={g} />
      <PaintBrushSection g={g} />
      <PixelControls g={g} />
      <PixelateControls g={g} />
      <FormulaControls g={g} />
      <EmojiControls g={g} />
      <ExportSection g={g} />
    </aside>
  );
}
