import { AnimateInterupt, Frame, MapPosition, MoveInterupt, SpriteIndex } from "./types";

export const MOVE_DOWN: SpriteIndex[] = [
  [0, 0],
  [0, 1],
];
export const MOVE_UP: SpriteIndex[] = [
  [0, 2],
  [0, 3],
];
export const MOVE_LEFT: SpriteIndex[] = [
  [1, 0],
  [1, 1],
];
export const MOVE_RIGHT: SpriteIndex[] = [
  [1, 2],
  [1, 3],
];
export const EAT_LEFT: SpriteIndex[] = [
  [2, 0],
  [2, 0],
  [2, 1],
  [2, 1],
];
export const EAT_RIGHT: SpriteIndex[] = [
  [2, 2],
  [2, 2],
  [2, 3],
  [2, 3],
];

export interface Animate {
  spriteState: [number, number];
  readonly interval: Frame;
  readonly spriteIndexGenerator: Generator<SpriteIndex, never, AnimateInterupt>;
}

export interface Move extends Animate {
  readonly screenPosGenerator: Generator<MapPosition, never, MoveInterupt>;
  readonly interval: 1;
}
