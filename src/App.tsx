import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Game from "./Game";

export default function App() {
  return (
    <div
      id="canvas-container"
      style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}
    >
      <Canvas>
        <Physics debug>
          <Game />
        </Physics>
      </Canvas>
    </div>
  );
}
