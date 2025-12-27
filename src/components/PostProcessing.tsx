import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1} />
      <Vignette darkness={0.7} />
      <Noise opacity={0.15} />
    </EffectComposer>
  );
}
