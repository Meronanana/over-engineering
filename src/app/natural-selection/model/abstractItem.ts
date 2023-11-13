import { getRadian } from "@/utils/physicalEngine";
import { Animate, Move } from "./animation";
import { CreatureRef, FoodRef } from "./render";
import {
  CreatureType,
  FoodType,
  Frame,
  MapPosition,
  SensingInterupt,
  CreatureState,
  Status,
  Turn,
  getDistance,
} from "./types";
import { aFRAME } from "./constants";

export abstract class Edible {
  position: MapPosition;
  eaten: boolean = false;

  constructor(position: MapPosition) {
    this.position = position;
  }

  getSupply(): number {
    return 0;
  }
}

export abstract class Food extends Edible implements Animate {
  foodType: FoodType = FoodType.NONE;
  turnForDecay: Turn;

  numOfSprite: number = 0;
  spriteState: number = 0;
  interval = Frame(6);

  constructor(turnForDecay: Turn, position: MapPosition) {
    super(position);
    this.turnForDecay = turnForDecay;
  }

  spriteIndexGenerator: Generator<number, never, any> = (function* () {
    throw Error("제너레이터를 재선언하세요");
  })();

  override getSupply(): number {
    // TODO: 구현하기
    return 0;
  }
}

export abstract class Creature extends Edible implements Move {
  creatureType: CreatureType = CreatureType.NONE;
  creatureState: CreatureState = CreatureState.IDLE;
  gain: number = 0;
  status: Status;
  turnForLife: Turn;
  numOfSprite: number = 0;
  spriteState: number = 0;
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
        break;
      }
    }

    if (predetorIndex !== -1) {
      console.log("PREDETOR");
      const predator = creatures[predetorIndex].data;
      const dx = predator.position.X - this.position.X;
      const dy = predator.position.Y - this.position.Y;
      const direction = getRadian({ vx: dx, vy: dy }) + Math.PI;
      const pos = { X: this.status.sense * Math.cos(direction), Y: this.status.sense * Math.sin(direction) };

      let interupt: SensingInterupt = { type: CreatureState.AVIOD_FROM_PREDATOR, pos: pos };
      this.screenPosGenerator.next(interupt);

      this.creatureState = CreatureState.AVIOD_FROM_PREDATOR;
      return;
    }

    // 2. 인접한 식량 섭취
    if (this.creatureState === CreatureState.FIND_FOOD) {
      // console.log("chkchk");
      let nearFood = [-1, -1]; // [type(creature, food), index]
      for (let i = 0; i < foods.length; i++) {
        const foodData = foods[i].data;
        const distance = getDistance(foodData.position, this.position);
        if (nearFood[0] === -1 && distance <= 0.6) {
          console.log(distance);
          nearFood = [1, i];
        }
      }
      for (let i = 0; i < creatures.length; i++) {
        const creatureData = creatures[i].data;
        const distance = getDistance(creatureData.position, this.position);
        if (creatureData === this) continue;
        if (nearFood[0] === -1 && distance <= 0.6) {
          // console.log(distance);
          nearFood = [0, i];
        }
      }

      if (nearFood[0] !== -1) {
        console.log("EEEEEEEEAT");
        let target: Edible;
        if (nearFood[0] === 0) {
          target = creatures[nearFood[1]].data;
        } else if (nearFood[0] === 1) {
          target = foods[nearFood[1]].data;
        } else {
          throw Error("Target이 Edible이 아닙니다.");
        }

        let interupt: SensingInterupt = { type: CreatureState.EAT_FOOD, pos: this.position };
        this.screenPosGenerator.next(interupt);
        setTimeout(() => {
          this.gain += target.getSupply();
          target.eaten = true;
        }, aFRAME * 12);

        this.creatureState = CreatureState.EAT_FOOD;
        return;
      }
    }

    // 3. 식량 추적
    if (this.creatureState !== CreatureState.FIND_FOOD && this.creatureState !== CreatureState.EAT_FOOD) {
      let bestFood = [-1, -1, -1]; // [type(creature, food), index, supply]

      for (let i = 0; i < foods.length; i++) {
        const foodData = foods[i].data;
        if (getDistance(foodData.position, this.position) <= this.status.sense) {
          if (bestFood[0] !== -1) break;
          let supply = foodData.getSupply();
          bestFood = [1, i, supply];
        }
      }
      for (let i = 0; i < creatures.length; i++) {
        const creatureData = creatures[i].data;
        if (creatureData === this) continue;
        if (
          getDistance(creatureData.position, this.position) <= this.status.sense &&
          isEdibleCreature(this, creatureData)
        ) {
          if (bestFood[0] !== -1) break;
          let supply = creatureData.getSupply();
          bestFood = [0, i, supply];
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

        let interupt: SensingInterupt = { type: CreatureState.FIND_FOOD, pos: target.position };
        this.screenPosGenerator.next(interupt);

        this.creatureState = CreatureState.FIND_FOOD;
        return;
      }
    }
  }
}

export const isEdibleCreature = (predator: Creature, target: Creature): boolean => {
  return predator.status.size > target.status.size * 1.2;
};
