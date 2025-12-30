import { useEffect, useRef, useState } from "react";
import ScaleSelector from "./components/ScaleSelector";
import GameFinishScreen from "./components/GameFinish";
import { SCALES } from "./constants";
import Game from "./Game";
import PitchNoteLogger from "./components/PitchLogger";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import type { CurrentObstacle, Scale } from "./types";
import CurrentNoteHUD from "./components/CurrentNoteHUD";
import SiteInfo from "./components/SiteInfo";

export default function App() {
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const noteSang = useRef<string | null>(null);
  const [currentObs, setCurrentObs] = useState<CurrentObstacle | null>(null);

  useEffect(() => {
    console.log("game started", gameStart);
  }, [gameStart]);

  function handleScaleSelect(scale: Scale) {
    setSelectedScale(scale);
    setGameFinished(false);
    setGameStart(false);
  }

  function handleGameFinish() {
    setGameFinished(true);
  }

  function handleRestart() {
    setSelectedScale(null);
    setGameFinished(false);
    setGameStart(false);
    noteSang.current = null;
  }

  return (
    <div
      id="canvas-container"
      className=" w-screen h-screen fixed inset-0 z-0 bg-secondary-foreground  "
    >
      {!selectedScale ? (
        <div className="z-10 absolute top-[10vh] left-0 right-0 mx-auto w-max rounded-[1em] shadow-[0_8px_32px_#0001] p-8">
          <ScaleSelector scales={SCALES} onSelect={handleScaleSelect} />
        </div>
      ) : (
        <>
          {currentObs && (
            <CurrentNoteHUD
              targetNote={currentObs.note}
              userNote={noteSang.current}
            />
          )}
          <Canvas
            style={{ zIndex: 0, backgroundColor: "black" }}
            shadows
            dpr={[1, 2]}
          >
            <Physics>
              {!gameFinished && (
                <Game
                  notes={selectedScale.notes}
                  noteSang={noteSang}
                  onFinish={handleGameFinish}
                  onCurrentObsChange={setCurrentObs}
                />
              )}
            </Physics>
          </Canvas>
          <div
            className="pitch-logger"
            style={{
              zIndex: 20,
              backgroundColor: "red",
              position: "fixed",
              top: "10%",
              left: "10%",
            }}
          >
            <PitchNoteLogger
              gameStart={gameStart}
              setGameStart={setGameStart}
              noteSang={noteSang}
            />
          </div>
          {gameFinished && <GameFinishScreen onRestart={handleRestart} />}
        </>
      )}

      <SiteInfo />
    </div>
  );
}
