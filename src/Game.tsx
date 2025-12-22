import * as THREE from "three";
import Ball from "./components/Ball";
import Track from "./components/Track";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useRef, useEffect, useState, type RefObject } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import Obstacle from "./Obstacle";
import { getNoteAdjustment, noteToNormalizedValue } from "./utils";

import HoveringBall from "./components/HoveringBall";
import PostProcessing from "./components/PostProcessing";
import type { CurrentObstacle } from "./types";
export default function Game({
  notes,
  noteSang,
  onFinish,
  onCurrentObsChange, // ADDED
}: {
  notes: string[];
  noteSang: RefObject<string | null>;
  onFinish: () => void;
  onCurrentObsChange: (obs: CurrentObstacle | null) => void; // type as needed
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

  console.log("note to hole y", noteToHoleY("A"));
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

      if (noteSang.current == currentObs.note) {
        let yJumpAdjust = getNoteAdjustment(currentObs.note);
        console.log("adjust vel", yJumpAdjust);
        body.setLinvel(
          {
            x: 0,
            y: velocityY + yJumpAdjust,
            z: velocityZ,
          },
          true
        );
      } else {
        const targetY = noteToHoleY(noteSang.current);
        velocityY = (targetY - ballPos[1] - 0.5 * g * t * t) / t;

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

  useEffect(() => {
    if (!currentObs) onFinish();
  }, [currentObs, onFinish]);

  useEffect(() => {
    onCurrentObsChange(currentObs || null);
    console.log(currentObs);
  }, [currentObs, onCurrentObsChange]);

  if (!currentObs) return null; // or return a custom <GameCompleteOverlay /> if you want an effect

  return (
    <>
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

      <HoveringBall position={[0, currentObs.holeY, currentObs.z]} />

      <ambientLight intensity={0.3} />
      <Environment files={"/textures/hdri.exr"} />

      <directionalLight
        color="white"
        position={[0, 10, 5]}
        receiveShadow
        castShadow
      />
      <Ball ref={ballRef} ballRadius={ballRadius} initialPos={[0, 1, 4]} />
      <Track />
      <PostProcessing />
    </>
  );
}
