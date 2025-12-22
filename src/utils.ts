import { NOTE_FREQS, NOTE_NAMES } from "./constants";

export function noteToNormalizedValue(note: string, min = 0, max = 1) {
  const match = note.match(/^([A-G]#?)/i);
  if (!match) return min;

  const noteName = match[1].toUpperCase();
  const idx = NOTE_NAMES.indexOf(noteName);
  if (idx === -1) return min;

  // Now, always use full list length:
  const t = idx / (NOTE_NAMES.length - 1);
  return min + t * (max - min);
}
export function getRequiredJumpStartZ(
  z_wall: number,
  holeY: number,
  forwardVel = -2,
  jumpVel: number,
  groundY: number = 0,
  gravity = -9.8
) {
  // 1. Solve for dt: Find t when y = holeY
  // 0 = y0 - holeY + Vy*dt + 0.5*g*dt^2
  // This is a quadratic: a*dt^2 + b*dt + c = 0
  const a = 0.5 * gravity;
  const b = jumpVel;
  const c = groundY - holeY;

  // Quadratic root
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null; // No solution!

  const dt = (-b + Math.sqrt(discriminant)) / (2 * a); // Use the later time (ascending the arc)
  // (If dt < 0, try the other root with -Math.sqrt)

  // 2. How far away do we need to be on Z to use this dt?
  // distance = |Vz| * dt
  const dz = Math.abs(forwardVel) * dt;
  return z_wall + dz; // Ball should be at this z when jump occurs
}

export function playNote(freq = 440, duration = 0.5, type = "sine") {
  const ctx = new window.AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type as OscillatorType;
  oscillator.frequency.value = freq;

  gain.gain.setValueAtTime(0.24, ctx.currentTime); // Volume
  oscillator.connect(gain).connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  // stop and disconnect to free memory
  oscillator.onended = () => {
    gain.disconnect();
    oscillator.disconnect();
    ctx.close();
  };
}

export function getNoteAdjustment(note: string) {
  switch (note) {
    case "C":
    case "C#":
      return -0.6;
    case "D":
      return -0.6;
    case "D#":
      return -0.9;
    case "E":
      return -0.4;
    case "F":
      return -0.4;
    case "F#":
      return -0.6;
    case "G":
      return -0.1;
    case "G#":
      return -0.2;
    case "A":
    case "A#":
      return -0.2;
    default:
      return -0.2;
  }
}

export function playNoteByName(
  name: keyof typeof NOTE_FREQS,
  duration = 0.6,
  type = "sine"
) {
  const freq = NOTE_FREQS[name];
  if (freq) playNote(freq, duration, type);
}
