import { Animate, Move } from "./animation";
import { Frame, MapPosition, Status, Turn } from "./types";

export enum CreatureType {
  PIKACHU = "pikachu",
  PAIRI = "pairi",
  ISANGHAESSI = "isanghaessi",
  GGOBUGI = "ggobugi",
}

export enum FoodType {
  APPLE = "apple",
  PEACH = "peach",
  FISH = "fish",
}
abstract class Edible {
  position: MapPosition;
  supply: number;

  constructor(position: MapPosition, supply: number) {
    this.position = position;
    this.supply = supply;
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
    supply: number,
    numOfState: number,
    interval: Frame,
    generator: Generator<number, never, number>
  ) {
    super(position, supply);
    this.foodType = foodType;
    this.turnForDecay = turnForDecay;

    this.numOfState = numOfState;
    this.spriteIndexGenerator = generator;
    this.interval = interval;
  }
}

export class Creature extends Edible implements Move {
  creatureType: CreatureType;
  gain: number = 0;
  status: Status;
  turnForLife: Turn;

  numOfState: number;
  currentState: number = 0;
  interval: 1 = 1;
  spriteIndexGenerator: Generator<number, never, number>;
  screenPosGenerator: Generator<MapPosition, never, MapPosition>;

  constructor(
    creatureType: CreatureType,
    status: Status,
    turnForLife: Turn,
    position: MapPosition,
    supply: number,
    numOfState: number,
    spriteIndexGenerator: Generator<number, never, number>,
    screenPosGenerator: Generator<MapPosition, never, MapPosition>
  ) {
    super(position, supply);
    this.creatureType = creatureType;
    this.status = status;
    this.turnForLife = turnForLife;

    this.numOfState = numOfState;
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
