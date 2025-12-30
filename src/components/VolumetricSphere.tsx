import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const vert = `
  varying vec3 vWorld;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorld = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const frag = `
  uniform vec3 fogColor;
  uniform float density;
  uniform float radius;
  uniform vec3 sphereCenter;
  varying vec3 vWorld;

  void main() {
    float distToCenter = length(vWorld - sphereCenter);
    float t = smoothstep(radius * 0.0, radius, distToCenter);

    float distToCamera = length(vWorld - cameraPosition);
    // Normalize: 0 at center, 1 at sphere surface
    float normDist = clamp(distToCamera / radius, 0.0, 1.0);

    // Exponential fog, increased by normDist**power (try power = 1.5~2 for fast ramp)
    float spatialPower = 1.7; // Try 1.0 to 2.5 for ramp "shape"
    float fog = exp(-density * pow(1.0 - t, 2.0));
    float spatialFog = pow(normDist, spatialPower);
    float alpha = clamp(fog * spatialFog, 0.0, 1.0);

    vec3 color = mix(vec3(0.0), fogColor, alpha);
    gl_FragColor = vec4(color, alpha * 0.8); // .8 for some base transparency

    // For debugging:
    // gl_FragColor = vec4(normDist, 0.0, 1.0-normDist, 0.35);
    if (alpha < 0.01) discard;
  }
`;

const SphereFogMaterial = shaderMaterial(
  {
    fogColor: new THREE.Color("#bfc7ce"),
    density: 1.1,
    radius: 50,
    sphereCenter: new THREE.Vector3(0, 0, 0),
  },
  vert,
  frag
);

extend({ SphereFogMaterial });

export default function VolumetricSphereFog({
  position = [0, 0, 0],
  radius = 250,
  color = "#bfc7ce",
  density = 1.1,
  ...props
}: any) {
  const mat = useRef<any>(null);
  useFrame(() => {
    if (mat.current) {
      mat.current.fogColor = new THREE.Color(color);
      mat.current.density = density;
      mat.current.radius = radius;
      mat.current.sphereCenter = new THREE.Vector3(...position);
      // This is the key! Always update with current camera position
    }
  });

  return (
    <mesh
      position={position}
      rotation={[Math.PI / 2, Math.PI / 2, 0]}
      {...props}
    >
      <sphereGeometry args={[radius, 3, 3]} />
      {/* @ts-ignore */}
      <sphereFogMaterial ref={mat} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
