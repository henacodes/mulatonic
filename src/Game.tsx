import * as THREE from "three";
import Ball from "./components/Ball";
import Track from "./components/Track";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Physics, RapierRigidBody } from "@react-three/rapier";

export default function Game() {
  const ballRef = useRef<RapierRigidBody>(null);
  const [ballPos, setBallPos] = useState<THREE.Vector3Tuple>([0, 1, 4]);

  // Keyboard state and handler logic
  const moving = useRef({ fwd: false, bwd: false, jump: false });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") moving.current.fwd = true;
      if (e.code === "ArrowLeft") moving.current.bwd = true;
      if (e.code === "Space") moving.current.jump = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") moving.current.fwd = false;
      if (e.code === "ArrowLeft") moving.current.bwd = false;
      if (e.code === "Space") moving.current.jump = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Control and limit ball movement using physics
  useFrame(() => {
    const body = ballRef.current;
    if (!body) return;

    // Get current position (for camera following)
    const p = body.translation();
    //setBallPos([p.x, p.y, p.z]);

    // Physics params
    const MAX_MOVING_SPEED = 5;
    const MAX_JUMP_SPEED = 5;
    const JUMP_IMPULSE = 0.14;

    const vel = body.linvel();
    if (moving.current.fwd && vel.z > -MAX_MOVING_SPEED) {
      body.applyImpulse({ x: 0, y: 0, z: -0.2 }, true);
    }
    if (moving.current.bwd && vel.z < MAX_MOVING_SPEED) {
      body.applyImpulse({ x: 0, y: 0, z: 0.2 }, true);
    }
    const onGround = Math.abs(body.translation().y - 0.25) < 0.03;
    if (moving.current.jump && vel.y < MAX_JUMP_SPEED * 0.5) {
      body.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true);
    }

    // Clamp speeds as safety
    if (
      Math.abs(vel.y) > MAX_JUMP_SPEED &&
      (moving.current.bwd || moving.current.fwd)
    ) {
      console.log("incremementing");
      body.setLinvel(
        { x: vel.x, y: Math.sign(vel.y) * MAX_JUMP_SPEED, z: vel.z },
        true
      );
    }
    if (Math.abs(vel.z) > MAX_MOVING_SPEED && moving.current.jump) {
      body.setLinvel(
        { x: vel.x, y: vel.y, z: Math.sign(vel.z) * MAX_MOVING_SPEED },
        true
      );
    }
  });

  return (
    <>
      <axesHelper args={[2]} />
      <OrbitControls
        target={[ballPos[0], 2, ballPos[2]]}
        maxPolarAngle={Math.PI / 2}
      />
      <PerspectiveCamera
        position={[ballPos[0] + 3, 3, ballPos[2] + 5]}
        makeDefault
      />
      <ambientLight intensity={0.3} />
      <directionalLight color="white" position={[0, 10, 5]} />
      <Ball ref={ballRef} initialPos={[0, 1, 4]} />
      <Track />
    </>
  );
}
