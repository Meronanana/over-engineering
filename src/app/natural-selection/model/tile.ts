import { Animate } from "./animation";
import { Frame } from "./types";

/*
TileType은 길이가 4인 문자열로 표현됩니다.
각 자리의 의미는 다음과 같습니다.
첫 자리: 테마
둘째 자리: 보급 가능 여부
셋째 자리: 통행 가능 여부
넷째 자리: 버전
 */
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
