import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Planet() {
  const texture = useTexture("/textures/saturn.jpg");
  const saturnRingTex = useTexture("/textures/saturn_ring.png");

  const ringRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<any>(null);

  const planetRef = useRef<THREE.Mesh>(null);
  const position: THREE.Vector3Tuple = [-100, -15, -60];

  useFrame(({ clock }) => {
    const figure8Width = 3.0; // <-- Increase for wider movement (X-axis)
    const figure8Height = 2.0; // <-- Increase for taller movement (Y-axis)
    const speed = 1;
    const t = clock.getElapsedTime();
    if (planetRef.current) {
      // Figure-8 (lemniscate)
      planetRef.current.position.x =
        position[0] + figure8Width * Math.sin(t * speed);
      planetRef.current.position.y =
        position[1] + figure8Height * Math.sin(t * speed) * Math.cos(t * speed);
      planetRef.current.rotateY(Math.PI / 100);
    }
  });

  return (
    <mesh
      ref={planetRef}
      rotation={[Math.PI / -1.1, 0, 0]}
      position={position}
      scale={8}
      castShadow={false}
      receiveShadow={false}
    >
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial map={texture} />
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={[2, 2, 1]}>
        <ringGeometry
          args={[1.2, 2, 96, 1]}
          ref={(geo) => {
            if (geo) {
              const pos = geo.attributes.position;
              const uv = geo.attributes.uv;
              const v3 = new THREE.Vector3();

              // Find midpoint between inner and outer for this segment
              // Inner radius: u = 0, Outer radius: u = 1
              for (let i = 0; i < pos.count; i++) {
                v3.fromBufferAttribute(pos, i);
                // v3.length() is the current radius at this vert
                uv.setXY(
                  i,
                  v3.length() < (1.2 + 2) / 2 ? 0 : 1,
                  Math.atan2(v3.y, v3.x) / (2 * Math.PI) + 0.5
                );
              }
              uv.needsUpdate = true;
            }
          }}
        />
        <meshBasicMaterial
          ref={ringMatRef}
          transparent
          blendAlpha={0.2}
          opacity={1}
          map={saturnRingTex}
          side={THREE.DoubleSide}
        />
      </mesh>
    </mesh>
  );
}
