import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1.6} />
      <Vignette darkness={0.9} />
      <Noise opacity={0.09} />
    </EffectComposer>
  );
}
