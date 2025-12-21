import type { Scale } from "../types";

export default function ScaleSelector({
  scales,
  onSelect,
}: {
  scales: Scale[];
  onSelect: (val: Scale) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-primary mb-2">
        Select a Scale to Practice
      </h2>
      {scales.map((scale) => (
        <button
          key={scale.name}
          className="
            text-[1.2em] px-8 py-3 rounded-md border-2 border-primary
            bg-secondary/10 font-semibold cursor-pointer
            transition hover:bg-primary/10 text-primary
          "
          onClick={() => onSelect(scale)}
        >
          {scale.name}: {scale.notes.join(" ")}
        </button>
      ))}
    </div>
  );
}
