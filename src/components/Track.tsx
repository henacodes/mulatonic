import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Track() {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, -5.25, 0]}>
        <boxGeometry args={[1.5, 0.4, 200]} />
        <meshStandardMaterial color={"#74ffb9"} />
        <CuboidCollider
          args={[1.5 / 1.6, 0.4 / 1.5, 40 / 1.9]}
          position={[0, -5.25, 0]}
        />
      </mesh>
    </RigidBody>
  );
}
