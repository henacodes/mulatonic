import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Game from "./Game";
import PitchNoteLogger from "./components/PitchLogger";
import { useRef, useState } from "react";
import { NOTE_NAMES } from "./constants";

export default function App() {
  const rowNotes = NOTE_NAMES; // or customize your notes here, e.g., ['C', 'E', 'G', 'B']
  const [gameStart, setGameStart] = useState(false);
  const noteSang = useRef<string | null>(null);
  return (
    <div
      id="canvas-container"
      style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}
    >
      <Canvas>
        <Physics debug>
          <Game notes={rowNotes} noteSang={noteSang} />
        </Physics>
      </Canvas>
      <div style={{ zIndex: 20, position: "fixed", top: "10%", left: "10%" }}>
        <PitchNoteLogger
          gameStart={gameStart}
          setGameStart={setGameStart}
          noteSang={noteSang}
        />
      </div>
    </div>
  );
}
