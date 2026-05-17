import { Download, RefreshCw, Shuffle } from "lucide-react";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";

export function QuickActions({ g }: { g: AlbumCoverGenerator }) {
  const showReroll =
    g.appMode === "emoji" || g.appMode === "pixel" || g.appMode === "formula";

  return (
    <div className="space-y-2">
      {g.appMode === "emoji" && (
        <button
          type="button"
          onClick={g.shuffleAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors rounded-md font-medium"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle Everything
        </button>
      )}
      <div
        className={
          showReroll ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 gap-2"
        }
      >
        {showReroll && (
          <button
            type="button"
            onClick={g.handleReroll}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors rounded-md text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Re-roll
          </button>
        )}
        <button
          type="button"
          onClick={g.downloadImage}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-md text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <label
        className={`flex items-center gap-2 text-xs text-neutral-400 pt-1 ${
          g.appMode !== "emoji" ? "opacity-40" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={g.autoRegenerate}
          disabled={g.appMode !== "emoji"}
          onChange={(e) => g.setAutoRegenerate(e.target.checked)}
          className="w-4 h-4 accent-fuchsia-500 disabled:cursor-not-allowed"
        />
        Auto-regenerate on changes
      </label>
    </div>
  );
}
