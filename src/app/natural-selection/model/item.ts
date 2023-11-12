import { Animate, Move } from "./animation";
import { CreatureType, FoodType, Frame, MapPosition, Status, Turn } from "./types";

abstract class Edible {
  position: MapPosition;

  constructor(position: MapPosition) {
    this.position = position;
  }

  getSupply(): number {
    return 0;
  }
}

export class Food extends Edible implements Animate {
  foodType: FoodType;
  turnForDecay: Turn;

  numOfState: number;
  currentState: number = 0;
  interval: number;
  spriteIndexGenerator: Generator<number, never, number>;

  constructor(
    foodType: FoodType,
    turnForDecay: Turn,
    position: MapPosition,
    numOfState: number,
    interval: Frame,
    generator: Generator<number, never, number>
  ) {
    super(position);
    this.foodType = foodType;
    this.turnForDecay = turnForDecay;

    this.numOfState = numOfState;
    this.spriteIndexGenerator = generator;
    this.interval = interval;
  }

  override getSupply(): number {
    // TODO: 구현하기
    return 1;
  }
}

export abstract class Creature extends Edible implements Move {
  creatureType: CreatureType = CreatureType.NONE;
  gain: number = 0;
  status: Status;
  turnForLife: Turn;
  numOfState: number = 0;
  currentState: number = 0;
  interval: 1 = 1;

  constructor(status: Status, turnForLife: Turn, position: MapPosition) {
    super(position);
    this.status = status;
    this.turnForLife = turnForLife;
  }

  spriteIndexGenerator: Generator<number, never, number> = (function* () {
    while (true) {
      yield 1;
      throw Error("제너레이터를 재선언하세요");
    }
  })();
  screenPosGenerator: Generator<MapPosition, never, MapPosition> = (function* () {
    while (true) {
      yield { X: -1, Y: -1 };
      throw Error("제너레이터를 재선언하세요");
    }
  })();

  override getSupply(): number {
    return Math.pow(this.status.size, 3);
  }

  getBasecost(): number {
    const stat = this.status;
    return Math.pow(stat.size, 3) * Math.pow(stat.speed, 2) + stat.sense;
  }

  sensing(): void {}
}
