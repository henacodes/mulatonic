import { forwardRef } from "react";
import { BallCollider, RigidBody, RapierRigidBody } from "@react-three/rapier";

const Ball = forwardRef<
  RapierRigidBody,
  { initialPos?: [number, number, number] }
>(({ initialPos = [0, 1, 4] }, ref) => (
  <RigidBody
    ref={ref}
    colliders={false}
    position={initialPos}
    restitution={0.3}
  >
    <mesh>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
    <BallCollider args={[0.25]} />
  </RigidBody>
));

export default Ball;
