import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function HoveringBall({
  position,
}: {
  position: THREE.Vector3Tuple;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 10) * 0.05;
  });

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#a29bfe" emissiveIntensity={2} />
    </mesh>
  );
}
