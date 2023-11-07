import { Animate, Move } from "./animation";
import { Frame, MapPosition, Status, Turn } from "./types";

abstract class Edible {
  position: MapPosition;
  supply: number;

  constructor(position: MapPosition, supply: number) {
    this.position = position;
    this.supply = supply;
  }
}

export class Food extends Edible implements Animate {
  turnForDecay: Turn;

  numOfState: number;
  currentState: number = 0;
  interval: number;
  spriteIndexGenerator: Generator<number, never, number>;

  constructor(
    turnForDecay: Turn,
    position: MapPosition,
    supply: number,
    numOfState: number,
    interval: Frame,
    generator: Generator<number, never, number>
  ) {
    super(position, supply);
    this.turnForDecay = turnForDecay;

    this.numOfState = numOfState;
    this.spriteIndexGenerator = generator;
    this.interval = interval;
  }
}

export class Creature extends Edible implements Move {
  gain: number = 0;
  status: Status;
  turnForLife: Turn;

  numOfState: number;
  currentState: number = 0;
  interval: number;
  spriteIndexGenerator: Generator<number, never, number>;
  screenPosGenerator: Generator<MapPosition, never, MapPosition>;

  constructor(
    status: Status,
    turnForLife: Turn,
    position: MapPosition,
    supply: number,
    numOfState: number,
    interval: number,
    spriteIndexGenerator: Generator<number, never, number>,
    screenPosGenerator: Generator<MapPosition, never, MapPosition>
  ) {
    super(position, supply);
    this.status = status;
    this.turnForLife = turnForLife;

    this.numOfState = numOfState;
    this.interval = interval;
    this.spriteIndexGenerator = spriteIndexGenerator;
    this.screenPosGenerator = screenPosGenerator;
  }

  getBasecost(): number {
    const stat = this.status;
    return Math.pow(stat.size, 3) * Math.pow(stat.speed, 2) + stat.sense;
  }

  sensing(): void {
    // state 업데이트 할 함수 구현
  }
}
