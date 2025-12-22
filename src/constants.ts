import type { Scale } from "./types";

export const NOTE_NAMES = [
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

export const SCALES: Scale[] = [
  { name: "Pentatonic", notes: ["C", "D", "E", "G", "A", "C"] },
  { name: "Tezeta Minor", notes: ["A", "B", "C", "E", "F", "A"] },
  { name: "Ambassel", notes: ["E", "F", "A", "B", "C", "E"] },
  { name: "Anchi Hoye Lene", notes: ["B", "C", "E", "F", "G#", "B"] },
  { name: "Bati Major", notes: ["C", "E", "F", "G", "B", "C"] },
];

export const NOTE_FREQS = {
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  // Add other octaves as needed!
};
