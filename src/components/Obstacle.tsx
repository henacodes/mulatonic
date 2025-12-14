import { Geometry, Base, Subtraction } from "@react-three/csg";
import * as THREE from "three";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
} from "@react-three/rapier";

export function ObstacleCSG({
  position = [0, 0, 0],
  rectSize = [4, 1, 0.5], // width, height, depth of the rectangle
  holeRadius = 0.3, // radius of the circular hole
  holeY = 0.5, // vertical offset of the hole in the rectangle
}: {
  position?: THREE.Vector3Tuple;
  rectSize?: THREE.Vector3Tuple;
  holeRadius?: number;
  holeY?: number;
}) {
  const [rectWidth, rectHeight, rectDepth] = rectSize;

  let holeHeight = holeRadius * 2;

  const chunkThickness = rectHeight / 2 - holeHeight / 2;

  return (
    /*    <mesh position={position}>
      <meshStandardMaterial color="orange" />
      <Geometry>
        <Base>
          <boxGeometry args={rectSize} />
        </Base>
 
        <Subtraction
          position={[0, holeY, 0]} // center hole vertically in box, use holeY for offset
          rotation={[Math.PI / 2, 0, Math.PI / 2]} // rotate so cylinder points Z axis
        >
          <cylinderGeometry
            args={[holeRadius, holeRadius, rectSize[2] + 0.1, 32]}
          />
        </Subtraction>
      </Geometry>
    </mesh> */
    <group position={position}>
      {/* Top chunk */}
      <RigidBody type="fixed" colliders={false}>
        <mesh>
          <boxGeometry args={[rectWidth, chunkThickness, rectDepth]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <CuboidCollider
          args={[rectWidth / 2, chunkThickness / 2, rectDepth / 2]}
          position={[0, holeY + holeHeight / 2 + chunkThickness / 2, 0]}
        />
      </RigidBody>
      {/* Bottom chunk */}
      <RigidBody type="fixed" colliders={false}>
        <mesh>
          <boxGeometry args={[rectWidth, chunkThickness, rectDepth]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <CuboidCollider
          args={[rectWidth / 2, chunkThickness / 2, rectDepth / 2]}
          position={[0, holeY - holeHeight / 2 - chunkThickness / 2, 0]}
        />
      </RigidBody>
    </group>
  );
}
