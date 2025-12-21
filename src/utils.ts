import { NOTE_NAMES } from "./constants";
export function noteToNormalizedValue(note: string, min = 3, max = 13) {
  const match = note.match(/^([A-G]#?)/i);
  if (!match) return min;
  const NOTE_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const noteName = match[1].toUpperCase();
  const idx = NOTE_NAMES.indexOf(noteName);
  if (idx === -1) return min;

  // Give values equally spaced between min and max
  const step = (max - min) / (NOTE_NAMES.length - 1);
  return min + idx * step;
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
