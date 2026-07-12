export interface Widget {
  idx: number;
  pos: [number, number];
  dir: number; // 0: up, 1: right, 2: down, 3: left
}

export interface Scale {
  name: string;
  scale: string[];
}

export interface SoundedCells {
  rows: number[];
  cols: number[];
}
