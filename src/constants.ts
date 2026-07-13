import type { Scale } from "./types";

export const DEFAULT_GRID_SIZE = 9;
export const GRID_SIZE_MIN = 3;
export const GRID_SIZE_MAX = 9;
export const DEFAULT_INTERVAL = 200;

export const ALL_SCALES: Scale[] = [
  { name: "Otomata", scale: ["E3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "D5"] },
  { name: "Aeolian", scale: ["E3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"] },
  { name: "Ake Bono", scale: ["E3", "A3", "B3", "C4", "E4", "F4", "A4", "B4", "C5"] },
  { name: "Yue-Diao", scale: ["E3", "B3", "D4", "E4", "G4", "A4", "B4", "D5", "E5"] },
  { name: "Bayati", scale: ["E3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"] },
  { name: "Dorian", scale: ["E3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4", "A4"] },
  { name: "Harmonic minor", scale: ["E3", "A3", "B3", "C4", "D4", "E4", "F4", "G#4", "A4"] },
  { name: "Hijaz", scale: ["E3", "A3", "A#3", "C#4", "D4", "E4", "F4", "G4", "A4"] },
  { name: "Hijaz kar", scale: ["E3", "A3", "A#3", "C#4", "D4", "E4", "F4", "G#4", "A4"] },
  { name: "Huzam", scale: ["E3", "A3", "C4", "C#4", "D4", "E4", "F#4", "G#4", "A4"] },
  { name: "Ionian", scale: ["E3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G#4", "A4"] },
  { name: "Kokin-Choshi", scale: ["E3", "A3", "A#3", "D4", "E4", "G4", "A4", "A#4", "D5"] },
  { name: "Kourd-Atar", scale: ["E3", "A3", "A#3", "C4", "D#4", "E4", "F4", "G#4", "A4"] },
  { name: "Lydian", scale: ["E3", "A3", "B3", "C#4", "D#4", "E4", "F#4", "G#4", "A4"] },
  { name: "Yu-Diao", scale: ["E3", "A3", "C4", "D4", "E4", "G4", "A4", "C5", "D5"] },
  { name: "Neveseri", scale: ["E3", "A3", "A#3", "C4", "C#4", "E4", "F4", "G4", "G#4"] },
  { name: "Niavent", scale: ["E3", "A3", "B3", "C4", "D#4", "E4", "F4", "G#4", "A4"] },
  { name: "Nirz Rast", scale: ["E3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4"] },
  { name: "Gong-Diao", scale: ["E3", "A3", "B3", "C#4", "E4", "F#4", "A4", "B4", "C#5"] },
  { name: "Zhi-Diao", scale: ["E3", "B3", "D4", "E4", "F#4", "G#4", "B4", "C#5", "E5"] },
  { name: "Purvi", scale: ["E3", "A3", "A#3", "C#4", "D#4", "E4", "F4", "G#4", "A4"] },
  { name: "Pygmy", scale: ["E3", "A3", "B3", "C4", "E4", "G4", "A4", "B4", "C5"] },
  { name: "Rast", scale: ["E3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G#4", "A4"] },
  { name: "Rumanikos", scale: ["E3", "A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "A4"] },
  { name: "Sabah", scale: ["E3", "A3", "B3", "C4", "C#4", "E4", "F4", "G4", "G#4"] },
  { name: "Segiah", scale: ["E3", "A3", "C4", "C#4", "D4", "E4", "F4", "G#4", "A4"] },
  { name: "Sho", scale: ["E3", "A3", "B3", "C4", "D4", "E4", "F#4", "A4", "B4"] },
  { name: "Blues", scale: ["E3", "A3", "C4", "D4", "D#4", "E4", "G4", "A4", "C5"] },
  { name: "Goonkali", scale: ["E3", "A3", "A#3", "D4", "E4", "F#4", "A4", "A#4", "D5"] },
  { name: "Iwato", scale: ["E3", "B3", "C4", "E4", "F4", "A4", "B4", "C5", "E5"] },
  { name: "Kumoi", scale: ["E3", "A3", "B3", "C4", "E4", "F#4", "A4", "B4", "C5"] },
  { name: "Locrian", scale: ["E3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"] },
  { name: "Magen Abot", scale: ["E3", "G#3", "A3", "B3", "C4", "D4", "E4", "G4", "G#4"] },
  { name: "Melog", scale: ["E3", "G#3", "A3", "B3", "D#4", "E4", "G#4", "A4", "B4"] },
  { name: "Mixolydian", scale: ["E3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4"] },
  { name: "Noh", scale: ["E3", "A3", "B3", "D4", "E4", "F4", "F#4", "G#4", "A4"] },
  { name: "Phrygian", scale: ["E3", "A3", "A#3", "C4", "D4", "E4", "F4", "G4", "A4"] },
  { name: "Pyeong Jo", scale: ["E3", "B3", "C#4", "E4", "G#4", "A4", "B4", "C#5", "E5"] },
  { name: "Shang-Diao", scale: ["E3", "A3", "B3", "D4", "E4", "G4", "A4", "B4", "D5"] },
  { name: "Zokuso", scale: ["E3", "B3", "C4", "E4", "F4", "G4", "B4", "C5", "E5"] },
];

export function getArrow(dir: number): string {
  if (dir === 0) return "↑";
  if (dir === 1) return "→";
  if (dir === 2) return "↓";
  return "←";
}

export function convertBpmToInterval(bpm: number): number {
  return 30000 / bpm;
}

export function convertIntervalToBpm(interval: number): number {
  return Math.round(30000 / interval);
}
