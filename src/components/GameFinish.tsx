// components/GameFinishScreen.tsx
export default function GameFinishScreen({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <>
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
        <h1>🎉 You Finished!</h1>
        <button
          onClick={onRestart}
          className=" mt-[1.2rem] text-[1.3rem] p-[0.7em] rounded-md cursor-pointer  text-primary-foreground bg-primary  "
        >
          Back to Scale Selection
        </button>
      </div>
      <div className=" fixed top-0 left-0 w-screen h-screen  backdrop-blur-md     "></div>
    </>
  );
}
