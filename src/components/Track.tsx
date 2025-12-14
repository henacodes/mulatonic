import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Track() {
  return (
    <RigidBody type="fixed">
      <mesh>
        <boxGeometry args={[1.5, 0.4, 10]} />
        <meshStandardMaterial color={"green"} />
        <CuboidCollider args={[5, 0.1, 0.5]} position={[0, 0, 0]} />
      </mesh>
    </RigidBody>
  );
}
