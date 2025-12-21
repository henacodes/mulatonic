import { useRef, type RefObject } from "react";

// NOTE: Use a bare import if you have it in node_modules, or an ESM CDN import in Vite-like environments.
// import { PitchDetector } from "pitchy";
import { PitchDetector } from "pitchy";
import { NOTE_NAMES } from "../constants";

function getNoteName(frequency: number) {
  if (!frequency || isNaN(frequency)) return "-";
  const noteNum = Math.round(12 * Math.log2(frequency / 440) + 69);
  const name = NOTE_NAMES[noteNum % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  return `${name}${octave}`;
}

export default function PitchNoteLogger({
  gameStart,
  setGameStart,
  noteSang,
}: {
  gameStart: boolean;
  setGameStart: (newState: boolean) => void;
  noteSang: RefObject<string | null>;
}) {
  const startedRef = useRef(false);
  const lastNoteRef = useRef<string | null>(null);

  async function startPitchDetection() {
    if (startedRef.current) return; // Prevent multiple starts
    startedRef.current = true;
    setGameStart(true);
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;

    // Required by some browsers: resume context on gesture
    if (audioContext.state === "suspended") await audioContext.resume();

    // Mic input
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.createMediaStreamSource(stream).connect(analyserNode);

    // Pitchy set up
    const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
    const input = new Float32Array(detector.inputLength);

    async function readPitch() {
      analyserNode.getFloatTimeDomainData(input);
      const [pitch, clarity] = detector.findPitch(
        input,
        audioContext.sampleRate
      );

      // pitch: in Hz, clarity: 0–1
      if (clarity > 0.95 && pitch > 40 && pitch < 2000) {
        // filter for real notes
        const note = getNoteName(pitch);
        if (note !== lastNoteRef.current) {
          lastNoteRef.current = note;
          noteSang.current = note.slice(0, -1); //remove the last character since it will only indicate an octave
        }
      } else {
        lastNoteRef.current = null;
        noteSang.current = null;
      }
      requestAnimationFrame(readPitch);
    }
    readPitch();
  }

  return (
    !gameStart && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            style={{
              fontSize: "1.2em",
              padding: "0.75em 2em",
              borderRadius: "0.5em",
              cursor: "pointer",
              border: "2px solid #8187dc",
              background: "#faf8ff",
              fontWeight: 600,
            }}
            onClick={startPitchDetection}
          >
            Start Game
          </button>
        </div>
      </div>
    )
  );
}
