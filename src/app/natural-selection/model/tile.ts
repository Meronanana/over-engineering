import { Animate } from "./animation";
import { Frame } from "./types";

export enum StaticTileType {
  Plain_BASE = "0000",
  TreeRoot_BASE = "1010",
}

export enum FloatingTileType {
  BLANK = "NNNN",
  TreeLeaves_BASE = "1100",
}

export class MapTile<T extends StaticTileType | FloatingTileType> {
  readonly tileType: T;

  constructor(tileType: T) {
    this.tileType = tileType;
  }
}

export class AnimateMapTile<T extends StaticTileType | FloatingTileType> extends MapTile<T> implements Animate {
  numOfSprite: number;
  spriteState: number = 0;
  interval: number;
  spriteIndexGenerator: Generator<number, never, number>;

  constructor(tileType: T, numOfState: number, interval: Frame, generator: Generator<number, never, number>) {
    super(tileType);
    this.numOfSprite = numOfState;
    this.interval = interval;
    this.spriteIndexGenerator = generator;
  }
}