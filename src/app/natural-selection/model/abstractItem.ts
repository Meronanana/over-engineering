import { getRadian } from "@/utils/physicalEngine";
import { Animate, Move } from "./animation";
import { CreatureRef, FoodRef } from "./render";
import {
  CreatureType,
  FoodType,
  Frame,
  MapPosition,
  MoveInterupt,
  CreatureState,
  Status,
  Turn,
  getDistance,
} from "./types";
import { FRAME_TIME, GENERATION_TIME, MAP_HEIGHT, MAP_WIDTH, TURN_TIME } from "./constants";

export abstract class Edible {
  position: MapPosition;
  delete: boolean = false;

  constructor(position: MapPosition) {
    this.position = position;
  }

  getSupply(): number {
    return 0;
  }
}

export abstract class Food extends Edible implements Animate {
  foodType: FoodType = FoodType.UNDEF;
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
  creatureType: CreatureType = CreatureType.UNDEF;
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

    const decTurnForLife = setInterval(() => {
      if (this.turnForLife === 0) {
        // Die
        console.log("LIFE END");
        clearInterval(decTurnForLife);
        this.delete = true;
        return;
      }
      this.turnForLife -= 1;
    }, TURN_TIME);

    const generationEnd = setInterval(() => {
      const baseCost = this.getBasecost();
      console.log("Generation Changes, GAIN: ", this.gain, " BASE: ", baseCost);
      if (this.gain > baseCost) {
        const chance = (this.gain - baseCost) / baseCost;
        if (chance > Math.random()) {
          // Duplicate
          let interupt: MoveInterupt = { type: CreatureState.DUPLICATE, pos: this.position };
          this.screenPosGenerator.next(interupt);

          this.creatureState = CreatureState.DUPLICATE;
        }
      } else {
        const chance = this.gain / baseCost;
        if (chance < Math.random()) {
          // Die
          console.log("LIFE END");
          clearInterval(generationEnd);
          this.delete = true;
        }
      }
      this.gain = 0;
    }, GENERATION_TIME);
  }

  spriteIndexGenerator: Generator<number, never, number> = (function* () {
    throw Error("제너레이터를 재선언하세요");
  })();
  screenPosGenerator: Generator<MapPosition, never, MoveInterupt> = (function* () {
    throw Error("제너레이터를 재선언하세요");
  })();

  override getSupply(): number {
    return Math.floor(Math.pow(this.status.size, 3) * 40);
  }

  getBasecost(): number {
    const stat = this.status;
    return (Math.pow(stat.size, 3) * Math.pow(stat.speed, 2) + stat.sense) * 10;
  }

  makeChildStatus(): Status {
    // +- 10% 변화
    const status = this.status;
    return {
      speed: status.speed * (Math.random() / 5 + 0.9),
      size: status.size * (Math.random() / 5 + 0.9),
      sense: status.sense * (Math.random() / 5 + 0.9),
    };
  }

  sensing(creatures: CreatureRef[], foods: FoodRef[]): void {
    // 1. 포식자 감지 시 반대 방향으로 도망
    if (this.creatureState === CreatureState.AVIOD_FROM_PREDATOR) {
      return;
    }

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
      const dx = this.position.X - predator.position.X;
      const dy = this.position.Y - predator.position.Y;
      const direction = getRadian({ vx: dx, vy: dy });

      let posX = this.position.X + this.status.sense * Math.cos(direction);
      let posY = this.position.Y - this.status.sense * Math.sin(direction);
      if (posX < 0) posX = 0;
      if (posX > MAP_WIDTH - 1) posX = MAP_WIDTH - 1;
      if (posY < 0) posY = 0;
      if (posY > MAP_HEIGHT - 1) posY = MAP_HEIGHT - 1;
      const pos = { X: posX, Y: posY };

      let interupt: MoveInterupt = { type: CreatureState.AVIOD_FROM_PREDATOR, pos: pos };
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
          nearFood = [1, i];
        }
      }
      for (let i = 0; i < creatures.length; i++) {
        const creatureData = creatures[i].data;
        const distance = getDistance(creatureData.position, this.position);
        if (creatureData === this) continue;
        if (
          nearFood[0] === -1 &&
          distance <= 0.6 &&
          this.creatureType !== creatureData.creatureType &&
          isEdibleCreature(this, creatureData)
        ) {
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

        let interupt: MoveInterupt = { type: CreatureState.EAT_FOOD, pos: this.position };
        this.screenPosGenerator.next(interupt);
        setTimeout(() => {
          if (this.creatureState === CreatureState.EAT_FOOD) {
            this.gain += target.getSupply();
            target.delete = true;
          }
        }, FRAME_TIME * 12);

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
          this.creatureType !== creatureData.creatureType &&
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

        let interupt: MoveInterupt = { type: CreatureState.FIND_FOOD, pos: target.position };
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
