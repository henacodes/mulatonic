export interface Scale {
  name: string;
  notes: string[];
}

export interface CurrentObstacle {
  z: number;
  note: string;
  holeY: number;
  holeRadius: number;
  width: number;
  height: number;
  depth: number;
}
