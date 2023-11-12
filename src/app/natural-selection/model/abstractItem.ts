import { getRadian } from "@/utils/physicalEngine";
import { Animate, Move } from "./animation";
import { CreatureRef, FoodRef } from "./render";
import {
  CreatureType,
  FoodType,
  Frame,
  MapPosition,
  SensingInterupt,
  SensingType,
  Status,
  Turn,
  getDistance,
} from "./types";
import { aFRAME } from "./constants";

export abstract class Edible {
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
    throw Error("제너레이터를 재선언하세요");
  })();
  screenPosGenerator: Generator<MapPosition, never, SensingInterupt> = (function* () {
    throw Error("제너레이터를 재선언하세요");
  })();

  override getSupply(): number {
    return Math.pow(this.status.size, 3);
  }

  getBasecost(): number {
    const stat = this.status;
    return Math.pow(stat.size, 3) * Math.pow(stat.speed, 2) + stat.sense;
  }

  sensing(creatures: CreatureRef[], foods: FoodRef[]): void {
    // 1. 포식자 감지 시 반대 방향으로 도망
    let predetorIndex = -1;
    for (let i = 0; i < creatures.length; i++) {
      const creatureData = creatures[i].data;
      if (
        getDistance(creatureData.position, this.position) <= this.status.sense &&
        isEdibleCreature(creatureData, this)
      ) {
        predetorIndex = i;
      }
    }

    if (predetorIndex !== -1) {
      console.log("PREDETOR");
      const predator = creatures[predetorIndex].data;
      const dx = predator.position.X - this.position.X;
      const dy = predator.position.Y - this.position.Y;
      const direction = getRadian({ vx: dx, vy: dy }) + Math.PI;
      const pos = { X: this.status.sense * Math.cos(direction), Y: this.status.sense * Math.sin(direction) };

      let interupt: SensingInterupt = { type: SensingType.PREDATOR, pos: pos };
      this.screenPosGenerator.next(interupt);
      return;
    }

    // 2. 가장 가치가 높은 식량 추적
    let bestFood = [-1, -1, -1]; // [type(creature, food), index, supply]
    for (let i = 0; i < creatures.length; i++) {
      const creatureData = creatures[i].data;
      if (
        getDistance(creatureData.position, this.position) <= this.status.sense &&
        isEdibleCreature(this, creatureData)
      ) {
        let supply = creatureData.getSupply();
        if (bestFood[0] === -1) bestFood = [0, i, supply];
        else if (bestFood[2] < supply) bestFood = [0, i, supply];
      }
    }
    for (let i = 0; i < foods.length; i++) {
      const foodData = foods[i].data;
      if (getDistance(foodData.position, this.position) <= this.status.sense) {
        let supply = foodData.getSupply();
        if (bestFood[0] === -1) bestFood = [1, i, supply];
        else if (bestFood[2] < supply) bestFood = [1, i, supply];
      }
    }

    if (bestFood[0] !== -1) {
      console.log("FOOOOOOOOOOOD");
      let target: Edible;
      if (bestFood[0] === 0) {
        target = creatures[bestFood[1]].data;
      } else if (bestFood[0] === 1) {
        target = foods[bestFood[1]].data;
      } else {
        throw Error("Target이 Edible이 아닙니다.");
      }

      let interupt: SensingInterupt = { type: SensingType.FOOD, pos: target.position };
      this.screenPosGenerator.next(interupt);
      return;
    }
  }
}

export const isEdibleCreature = (predator: Creature, target: Creature): boolean => {
  return predator.status.size > target.status.size * 1.2;
};
