import { forwardRef } from "react";
import { BallCollider, RigidBody, RapierRigidBody } from "@react-three/rapier";

const Ball = forwardRef<
  RapierRigidBody,
  { initialPos?: [number, number, number]; ballRadius: number }
>(({ initialPos = [0, 1, 4], ballRadius }, ref) => (
  <RigidBody
    ref={ref}
    colliders={false}
    position={initialPos}
    restitution={0.3}
  >
    <mesh>
      <sphereGeometry args={[ballRadius, 32, 32]} />
      <meshStandardMaterial
        color="#90AB8B"
        emissive="#90AB8B"
        emissiveIntensity={3}
      />
    </mesh>
    <BallCollider args={[0.25]} />
  </RigidBody>
));

export default Ball;
