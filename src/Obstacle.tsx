import { useRef, useEffect } from "react";
import { Text, useTexture } from "@react-three/drei";

import { Geometry, Base, Subtraction } from "@react-three/csg";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";

type ObstacleProps = {
  position: THREE.Vector3Tuple;
  note: string;
  holeY: number;
  holeRadius: number;
  width: number;
  height: number;
  depth: number;
  isCurrent: boolean;
};

export default function Obstacle({
  position,
  note,
  holeY,
  holeRadius,
  width,
  height,
  depth,
  isCurrent = false,
}: ObstacleProps) {
  // Calculate geometry/chunk positions
  const holeHeight = holeRadius * 2;
  const wallTop = height / 2;
  const wallBottom = -height / 2;
  const holeTop = holeY + holeHeight / 2;
  const holeBottom = holeY - holeHeight / 2;

  const topChunkHeight = wallTop - holeTop;
  const bottomChunkHeight = holeBottom - wallBottom;
  const topChunkY = wallTop - topChunkHeight / 2;
  const bottomChunkY = wallBottom + bottomChunkHeight / 2;

  // Optionally, handle highlighting/collider enable/disable:
  const topRef = useRef<RapierRigidBody>(null);
  const bottomRef = useRef<RapierRigidBody>(null);

  const wallTexture = useTexture("/textures/brick.jpg"); // Your texture path!
  useEffect(() => {
    // Try different numbers until it looks right
    wallTexture.wrapS = THREE.RepeatWrapping;

    wallTexture.repeat.set(1, 2);
  }, [wallTexture]);

  return (
    <group position={position}>
      {/* Visual Mesh with the hole */}
      <mesh>
        <meshStandardMaterial color={"#54c974"} />
        <Geometry>
          <Base>
            <boxGeometry args={[width, height, depth]} />
          </Base>
          {/* Carve out the tunnel/hole */}
          <Subtraction rotation={[Math.PI / 2, 0, 0]} position={[0, holeY, 0]}>
            <cylinderGeometry args={[holeRadius, holeRadius, depth * 2, 32]} />
          </Subtraction>
        </Geometry>
      </mesh>

      {/* Collider for the upper chunk */}
      {topChunkHeight > 0 && (
        <RigidBody ref={topRef} type="fixed" colliders={false}>
          <CuboidCollider
            args={[width / 2, topChunkHeight / 2, depth / 2]}
            position={[0, topChunkY, 0]}
          />
        </RigidBody>
      )}

      {bottomChunkHeight > 0 && (
        <RigidBody ref={bottomRef} type="fixed" colliders={false}>
          <CuboidCollider
            args={[width / 2, bottomChunkHeight / 2, depth / 2]}
            position={[0, bottomChunkY, 0]}
          />
        </RigidBody>
      )}

      <Text
        position={[0, wallTop + 0.25, 0]}
        fontSize={0.5}
        color="#ffd166"
        anchorX="center"
        anchorY="bottom"
        outlineColor="white"
        outlineWidth={0.005}
      >
        {note}
      </Text>
    </group>
  );
}
