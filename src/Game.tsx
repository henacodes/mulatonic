import * as THREE from "three";
import Ball from "./components/Ball";
import Track from "./components/Track";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect, useState, type RefObject, type JSX } from "react";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Obstacle from "./Obstacle";
import { noteToNormalizedValue } from "./utils";
import { NOTE_NAMES } from "./constants";

export default function Game({
  notes,
  noteSang,
}: {
  notes: string[];
  noteSang: RefObject<string | null>;
}) {
  const ballRef = useRef<RapierRigidBody>(null);
  const [ballPos, setBallPos] = useState<THREE.Vector3Tuple>([0, 1, 4]);
  const ballRadius = 0.15;

  const wallWidth = 1;
  const wallHeight = 10;
  const wallDepth = 0.3;
  const holeRadius = 0.3;

  const holeSpread = 0.9; // Only use 60% of wall's vertical space for holes
  const verticalMargin = (wallHeight * (1 - holeSpread)) / 2;
  const minHoleY = -wallHeight / 2 + holeRadius + verticalMargin;
  const maxHoleY = wallHeight / 2 - holeRadius - verticalMargin;
  const obstacleSpacing = 8;
  const jumpZoneDistance = 1.2;

  function noteToHoleY(note: string) {
    const t = noteToNormalizedValue(note, 0, 1); // normalized 0-1
    return minHoleY + t * (maxHoleY - minHoleY);
  }
  const obstacles = notes.map((note, i) => ({
    z: -i * obstacleSpacing,
    note,
    holeY: noteToHoleY(note),
    holeRadius,
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
  }));

  const currentObs = obstacles
    .filter((obs) => obs.z < ballPos[2])
    .sort((a, b) => b.z - a.z)[0];
  // Or:
  const currentObsIndex = obstacles.findIndex(
    (obs) => ballPos[2] < obs.z && ballPos[2] > obs.z - jumpZoneDistance
  );

  // Control and limit ball movement using physics
  useFrame(() => {
    const body = ballRef.current;
    if (!body) return;
    // Get current position (for camera following)
    const p = body.translation();
    setBallPos([p.x, p.y, p.z]);

    const vel = body.linvel();

    const onGround = ballPos[1] < -4.7;

    if (noteSang.current && onGround) {
      const distanceToWallZ = currentObs.z - ballPos[2];
      const distanceToHoleY = currentObs.holeY - ballPos[1];
      const g = -9.8;

      const t = 0.8;
      const velocityZ = distanceToWallZ / t;
      let velocityY = (distanceToHoleY - 0.5 * g * t * t) / t;

      console.log("SANG ", noteSang.current);

      if (noteSang.current == currentObs.note) {
        console.log("rightttttttttttt", velocityY);
        console.log("distance to hole y", distanceToHoleY);
        body.setLinvel(
          {
            x: 0,
            y:
              velocityY +
              (NOTE_NAMES.indexOf(currentObs.note) >= 6 ? -0.3 : -0.7),
            z: velocityZ,
          },
          true
        );
      } else {
        const targetY = noteToHoleY(noteSang.current);
        console.log("targetY", targetY);
        velocityY = (targetY - ballPos[1] - 0.5 * g * t * t) / t;

        console.log("Velocity Y", velocityY);
        body.setLinvel(
          {
            x: 0,
            y: velocityY,
            z: velocityZ,
          },
          true
        );
      }
    }

    const minJumpZDist = 3;
    const ballZ = ballPos[2];
    const obstacleZ = currentObs.z;
    const distToObs = ballZ - obstacleZ;

    // if ball is too close snap it further back before jump
    if (distToObs < minJumpZDist && onGround && vel.z <= 0.6) {
      const jumpHeight = Math.abs(currentObs.holeY - ballPos[1]);
      const newZ = obstacleZ + minJumpZDist;
      body.setTranslation(
        {
          x: ballPos[0],
          y: ballPos[1],
          z: newZ + (jumpHeight / 10) * 4,
        },
        true
      );
      body.setLinvel({ z: 0, x: 0, y: 0 }, true);
    }

    //incase the ball stays inside the whole
    if (distToObs <= 0.15) {
      body.applyImpulse({ x: 0, y: 0, z: -0.1 }, true);
    }
  });

  return (
    <>
      <axesHelper args={[2]} />
      <OrbitControls
        target={[ballPos[0], 0, ballPos[2]]}
        maxPolarAngle={Math.PI / 2}
      />
      <PerspectiveCamera
        position={[ballPos[0] + 3, -10, ballPos[2] + 5]}
        makeDefault
      />

      {obstacles.map((obs, i) => (
        <Obstacle
          key={obs.note + i}
          position={[0, 0, obs.z]}
          note={obs.note}
          holeY={obs.holeY}
          holeRadius={obs.holeRadius}
          width={obs.width}
          height={obs.height}
          depth={obs.depth}
          isCurrent={i === currentObsIndex}
        />
      ))}

      <ambientLight intensity={0.3} receiveShadow castShadow />

      <mesh position={[0, currentObs.holeY, currentObs.z]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <directionalLight
        color="white"
        position={[0, 10, 5]}
        receiveShadow
        castShadow
      />
      <Ball ref={ballRef} ballRadius={ballRadius} initialPos={[0, 1, 4]} />
      <Track />
    </>
  );
}
