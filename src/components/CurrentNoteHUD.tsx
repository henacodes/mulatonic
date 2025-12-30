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
      className="
        fixed top-[4vh] left-0 right-0 mx-auto w-1/2 z-100
        flex flex-row gap-12 justify-center items-center
        px-8 py-4 rounded-2xl  backdrop-blur-md shadow-xl
      "
    >
      <div className="text-[1.25em] font-semibold text-primary">
        You should sing
        <span className="font-mono font-extrabold text-complementary ml-3 text-[1.5em] px-1">
          {targetNote || "--"}
        </span>
      </div>
      <button
        className="
          text-[1.1em] px-7 py-2 rounded-md border-2 border-track
          bg-secondary/20 font-bold text-secondary cursor-pointer
          transition hover:bg-track/10 disabled:opacity-60
        "
        onClick={handlePlay}
        disabled={!targetNote}
        title={`Play note ${targetNote}`}
      >
        🔊 Play
      </button>
      <div className="text-[1.05em] text-secondary font-semibold">
        You sang:
        <span className="font-mono font-bold text-wall ml-2 text-[1.2em]">
          {userNote || "—"}
        </span>
      </div>
    </div>
  );
}
