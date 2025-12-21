import type { Scale } from "../types";

// components/ScaleSelector.tsx
export default function ScaleSelector({
  scales,
  onSelect,
}: {
  scales: Scale[];
  onSelect: (val: Scale) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <h2>Select a Scale to Practice</h2>
      {scales.map((scale, idx) => (
        <button
          key={scale.name}
          style={{
            fontSize: "1.2em",
            padding: "0.75em 2em",
            borderRadius: "0.5em",
            cursor: "pointer",
            border: "2px solid #8187dc",
            background: "#faf8ff",
            fontWeight: 600,
          }}
          onClick={() => onSelect(scale)}
        >
          {scale.name}: {scale.notes.join(" ")}
        </button>
      ))}
    </div>
  );
}
