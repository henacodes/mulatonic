import { NOTE_FREQS } from "../constants";
import { playNoteByName } from "../utils";

export default function CurrentNoteHUD({
  targetNote,
  userNote,
}: {
  targetNote: string;
  userNote: string | null;
}) {
  function handlePlay() {
    playNoteByName(`${targetNote}4` as keyof typeof NOTE_FREQS);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "4vh",
        left: 0,
        right: 0,
        margin: "0 auto",
        zIndex: 1002,
        display: "flex",
        flexDirection: "row",
        gap: "3em",
        justifyContent: "center",
        alignItems: "center",
        padding: "1em 2em",
        background: "rgba(255,255,255,0.7)",
        borderRadius: "1.2em",
        backdropFilter: "blur(7px)",
        boxShadow: "0 3px 24px #b3b8f822",
      }}
    >
      <div style={{ fontSize: "1.25em", fontWeight: 600, color: "#5474c9" }}>
        You should sing
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 900,
            color: "#ff8fab",
            marginLeft: 12,
            fontSize: "1.5em",
            padding: "0 0.3em",
          }}
        >
          {targetNote || "--"}
        </span>
      </div>
      <button
        style={{
          fontSize: "1.1em",
          padding: "0.6em 1.7em",
          borderRadius: "0.5em",
          cursor: "pointer",
          border: "2px solid #a29bfe",
          background: "#faf8ff",
          fontWeight: 700,
          color: "#8187dc",
        }}
        onClick={handlePlay}
        disabled={!targetNote}
        title={`Play note ${targetNote}`}
      >
        🔊 Play
      </button>
      <div style={{ fontSize: "1.05em", color: "#8187dc", fontWeight: 600 }}>
        {"You sang"}:
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            color: "#74b9ff",
            marginLeft: 8,
            fontSize: "1.2em",
          }}
        >
          {userNote || "—"}
        </span>
      </div>
    </div>
  );
}
