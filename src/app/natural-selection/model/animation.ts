import { Frame, MapPosition, MoveInterupt } from "./types";

export interface Animate {
  readonly numOfSprite: number;
  spriteState: number; // 0 is Idle, 1 is sensingInterupt
  readonly interval: Frame;
  readonly spriteIndexGenerator: Generator<number, never, number>;
}

export interface Move extends Animate {
  readonly screenPosGenerator: Generator<MapPosition, never, MoveInterupt>;
  readonly interval: 1;
}
