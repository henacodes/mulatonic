import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Track() {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 20]} />
        <meshStandardMaterial color={"green"} />
        <CuboidCollider
          args={[1.5 / 1.6, 0.4 / 1.5, 20 / 1.9]}
          position={[0, 0, 0]}
        />
      </mesh>
    </RigidBody>
  );
}
