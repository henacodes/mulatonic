import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Planet() {
  const texture = useTexture("/textures/saturn.jpg");
  const saturnRingTex = useTexture("/textures/saturn_ring.png");

  const ringRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<any>(null);

  useEffect(() => {
    if (saturnRingTex) {
      saturnRingTex.wrapS = THREE.ClampToEdgeWrapping;
      saturnRingTex.wrapT = THREE.ClampToEdgeWrapping;
      saturnRingTex.flipY = false;
      saturnRingTex.needsUpdate = true;
    }
  }, [saturnRingTex]);

  /*   useFrame((_, delta) => {
    if (ringMatRef.current && ringMatRef.current.map) {
      ringMatRef.current.map.offset.x += delta * 0.2; // tweak factor for speed!
      if (ringMatRef.current.map.offset.x > 1)
        ringMatRef.current.map.offset.x -= 1;
    } else {
      console.log(ringMatRef.current);
      console.log("notttttttttttttttttttttttt rotating");
    }
  }); */

  return (
    <mesh
      rotation={[Math.PI / -1.1, 0, 0]}
      position={[-100, -15, -60]}
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
                // (Optional) swap 0/1 if texture reversed; adjust as needed
              }
              uv.needsUpdate = true;
            }
          }}
        />
        <meshBasicMaterial
          ref={ringMatRef}
          transparent
          opacity={1}
          map={saturnRingTex}
          side={THREE.DoubleSide}
        />
      </mesh>
    </mesh>
  );
}
