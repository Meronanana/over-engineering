import { Animate } from "./animation";
import { AnimateInterupt, Frame, SpriteIndex } from "./types";

/*
TileType은 길이가 4인 문자열로 표현됩니다.
각 자리의 의미는 다음과 같습니다.
첫 자리: 테마
둘째 자리: 보급 가능 여부
셋째 자리: 통행 가능 여부
넷째 자리: 버전
 */
export enum FlatTileType {
  Grass_SPROUT = "0000",
  Grass_LEFT_TOP = "0007",
  Grass_TOP = "0008",
  Grass_RIGHT_TOP = "0009",
  Grass_LEFT = "0004",
  Grass_BASE = "0005",
  Grass_RIGHT = "0006",
  Grass_LEFT_BOTTOM = "0001",
  Grass_BOTTOM = "0002",
  Grass_RIGHT_BOTTOM = "0003",
  Grass_INNER_RIGHT_BOTTOM = "000q",
  Grass_INNER_LEFT_BOTTOM = "000w",
  Grass_INNER_RIGHT_TOP = "000a",
  Grass_INNER_LEFT_TOP = "000s",
  Plain_BASE1 = "1000",
  Plain_BASE2 = "1001",
  Plain_ROCK = "1002",
  Plain_GRASS = "1003",
}

export enum AboveDecorateType {
  Tree_ROOT1 = "2010",
  Tree_ROOT2 = "2011",
}

export enum OverDecorateType {
  Tree_LEAVES1 = "2100",
  Tree_LEAVES2 = "2101",
}

export type TileType = FlatTileType | AboveDecorateType | OverDecorateType;

export class MapTile<T extends TileType> {
  readonly tileType: T;

  constructor(tileType: T) {
    this.tileType = tileType;
  }
}

export class AnimateMapTile<T extends TileType> extends MapTile<T> implements Animate {
  spriteState: [number, number] = [0, 0];
  interval: number;
  spriteIndexGenerator: Generator<SpriteIndex, never, AnimateInterupt>;

  constructor(tileType: T, interval: Frame, generator: Generator<SpriteIndex, never, AnimateInterupt>) {
    super(tileType);
    this.interval = interval;
    this.spriteIndexGenerator = generator;
  }
}
