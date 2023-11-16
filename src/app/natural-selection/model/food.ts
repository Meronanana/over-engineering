import { Food } from "./abstractItem";
import { TURN_TIME } from "./constants";
import { FoodType, MapPosition, Turn, getRandomPosition } from "./types";

export class Apple extends Food {
  foodType = FoodType.APPLE;
  numOfSprite: number = 4;

  constructor(turnForDecay: Turn = Turn(64), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Apple) {
      while (true) {
        yield [0, 0];
      }
    })(this);

    // 턴 당 turnForDecay 값 감소
    const decTurnForDecay = setInterval(() => {
      if (this.turnForDecay === 0) {
        this.delete = true;
        clearInterval(decTurnForDecay);
        return;
      }
      this.turnForDecay -= 1;
    }, TURN_TIME);
  }

  override getSupply(): number {
    return 20;
  }
}

export class Peach extends Food {
  foodType = FoodType.PEACH;
  numOfSprite: number = 4;

  constructor(turnForDecay: Turn = Turn(96), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Peach) {
      while (true) {
        yield [0, 0];
      }
    })(this);

    // 턴 당 turnForDecay 값 감소
    const decTurnForDecay = setInterval(() => {
      if (this.turnForDecay === 0) {
        this.delete = true;
        clearInterval(decTurnForDecay);
        return;
      }
      this.turnForDecay -= 1;
    }, TURN_TIME);
  }

  override getSupply(): number {
    return 15;
  }
}

export class Fish extends Food {
  foodType = FoodType.FISH;
  numOfSprite: number = 4;

  constructor(turnForDecay: Turn = Turn(32), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Fish) {
      while (true) {
        yield [0, 0];
      }
    })(this);

    // 턴 당 turnForDecay 값 감소
    const decTurnForDecay = setInterval(() => {
      if (this.turnForDecay === 0) {
        this.delete = true;
        clearInterval(decTurnForDecay);
        return;
      }
      this.turnForDecay -= 1;
    }, TURN_TIME);
  }

  override getSupply(): number {
    return 35;
  }
}
