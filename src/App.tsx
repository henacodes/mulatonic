import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Game from "./Game";

export default function App() {
  return (
    <div
      id="canvas-container"
      style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}
    >
      <Canvas>
        <Physics>
          <Game />
        </Physics>
      </Canvas>
    </div>
  );
}
