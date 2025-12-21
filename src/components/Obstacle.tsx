import { Geometry, Base, Subtraction } from "@react-three/csg";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

type ObstacleProps = {
  position?: [number, number, number];
  rectWidth?: number;
  rectHeight?: number;
  rectDepth?: number;
  holeY?: number; // Center Y position of hole (relative to group)
  holeRadius?: number;
};

export default function ObstacleWithHole({
  position = [0, 0, 0],
  rectWidth = 0.4,
  rectHeight = 2,
  rectDepth = 0.5,
  holeY = 0.5,
  holeRadius = 0.3,
}: ObstacleProps) {
  const holeHeight = holeRadius * 2;

  // Compute top and bottom chunk thickness
  const wallTop = rectHeight / 2;
  const wallBottom = -rectHeight / 2;
  const holeTop = holeY + holeHeight / 2;
  const holeBottom = holeY - holeHeight / 2;

  const topChunkHeight = wallTop - holeTop;
  const bottomChunkHeight = holeBottom - wallBottom;

  // For physics colliders and solids: position is local to center of wall!
  const topChunkY = wallTop - topChunkHeight / 2;
  const bottomChunkY = wallBottom + bottomChunkHeight / 2;

  return (
    <group position={position}>
      <mesh>
        <meshStandardMaterial />
        <Geometry>
          <Base>
            <boxGeometry args={[rectWidth, rectHeight, rectDepth]} />
          </Base>
          <Subtraction rotation={[Math.PI / 2, 0, 0]} position={[0, holeY, 0]}>
            <cylinderGeometry args={[holeRadius, holeRadius, 10, 32]} />
          </Subtraction>
        </Geometry>
      </mesh>

      {/* Top chunk physics */}
      {topChunkHeight > 0 && (
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider
            args={[rectWidth / 2, topChunkHeight / 2, rectDepth / 2]}
            position={[0, topChunkY, 0]}
          />
        </RigidBody>
      )}
      {/* Bottom chunk physics */}
      {bottomChunkHeight > 0 && (
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider
            args={[rectWidth / 2, bottomChunkHeight / 2, rectDepth / 2]}
            position={[0, bottomChunkY, 0]}
          />
        </RigidBody>
      )}
    </group>
  );
}
