// components/GameFinishScreen.tsx
export default function GameFinishScreen({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "30vh",
        left: 0,
        right: 0,
        margin: "auto",
        width: "max-content",
        background: "#fff",
        borderRadius: "1em",
        boxShadow: "0 8px 32px #0002",
        padding: "3em 4em",
        textAlign: "center",
        zIndex: 99,
      }}
    >
      <h1
        style={{
          color: "#ff8fab",
          fontFamily: "sans-serif",
          fontSize: "2em",
          marginBottom: "0.5em",
        }}
      >
        🎉 You Finished!
      </h1>
      <button
        onClick={onRestart}
        style={{
          marginTop: "1.2em",
          fontSize: "1.3em",
          padding: "0.7em 2em",
          borderRadius: "0.5em",
          cursor: "pointer",
          background: "#a29bfe",
          border: "none",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "0 2px 20px #a29bfe44",
        }}
      >
        Back to Scale Selection
      </button>
    </div>
  );
}
