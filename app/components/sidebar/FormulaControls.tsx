import { Shuffle } from "lucide-react";
import type { AlbumCoverGenerator } from "@/app/hooks/useAlbumCoverGenerator";
import { RangeField, Section } from "@/app/components/ui/form-controls";

export function FormulaControls({ g }: { g: AlbumCoverGenerator }) {
  if (g.appMode !== "formula") return null;

  return (
    <Section title="Formula colors">
      <p className="text-xs text-neutral-500 mb-2">
        Static hue grid from x/y terms — same math as{" "}
        <span className="text-neutral-400">p5/colors</span>.
      </p>
      <RangeField
        label="Block size (px)"
        value={g.formulaBlockSize}
        min={10}
        max={150}
        step={1}
        onChange={g.setFormulaBlockSize}
      />
      <RangeField
        label="X"
        value={g.formulaCoeffX}
        min={0}
        max={100}
        step={1}
        onChange={g.setFormulaCoeffX}
      />
      <RangeField
        label="Y"
        value={g.formulaCoeffY}
        min={0}
        max={100}
        step={1}
        onChange={g.setFormulaCoeffY}
      />
      <RangeField
        label="X²"
        value={g.formulaCoeffX2}
        min={0}
        max={100}
        step={1}
        onChange={g.setFormulaCoeffX2}
      />
      <RangeField
        label="Y²"
        value={g.formulaCoeffY2}
        min={0}
        max={100}
        step={1}
        onChange={g.setFormulaCoeffY2}
      />
      <RangeField
        label="X³"
        value={g.formulaCoeffX3}
        min={0}
        max={1}
        step={0.01}
        onChange={g.setFormulaCoeffX3}
      />
      <RangeField
        label="Y³"
        value={g.formulaCoeffY3}
        min={0}
        max={1}
        step={0.01}
        onChange={g.setFormulaCoeffY3}
      />
      <RangeField
        label="Hue lower"
        value={g.formulaHueLower}
        min={0}
        max={255}
        step={1}
        onChange={g.setFormulaHueLower}
      />
      <RangeField
        label="Hue upper"
        value={g.formulaHueUpper}
        min={0}
        max={255}
        step={1}
        onChange={g.setFormulaHueUpper}
      />
      <RangeField
        label="Randomness"
        value={g.formulaRandomness}
        min={0}
        max={255}
        step={1}
        onChange={g.setFormulaRandomness}
      />
      <button
        type="button"
        onClick={g.shuffleFormula}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors rounded-md font-medium mt-2"
      >
        <Shuffle className="w-4 h-4" />
        Shuffle formula
      </button>
      <p className="text-xs text-neutral-500">
        Randomizes all sliders and redraws the grid.
      </p>
    </Section>
  );
}
