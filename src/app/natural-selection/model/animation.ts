import { Frame, MapPosition, SensingType } from "./types";

export interface Animate {
  readonly numOfState: number;
  currentState: number;
  readonly interval: Frame;
  readonly spriteIndexGenerator: Generator<number, never, number>;
}

export interface Move extends Animate {
  readonly screenPosGenerator: Generator<MapPosition, never, SensingInterupt>;
  readonly interval: 1;
}
