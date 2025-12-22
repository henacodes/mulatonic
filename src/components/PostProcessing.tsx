import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.4} />
      <Vignette darkness={0.9} />
      <Noise opacity={0.15} />
    </EffectComposer>
  );
}
