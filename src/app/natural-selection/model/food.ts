import { Food } from "./abstractItem";
import { TURN_TIME } from "./constants";
import { FoodType, MapPosition, SpriteIndex, Turn, getRandomPosition } from "./types";

export class Apple extends Food {
  foodType = FoodType.APPLE;

  constructor(turnForDecay: Turn = Turn(64), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Apple) {
      let vector: SpriteIndex[] = [];
      while (true) {
        if (vector.length === 0) {
          if (my.turnForDecay <= 4)
            vector = [
              [0, 4],
              [0, 4],
              [0, 4],
              [0, 4],
            ];
          else
            vector = [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 1],
              [0, 1],
              [0, 1],
              [0, 1],
            ];
        }
        while (vector.length !== 0) {
          let nextValue = vector.shift();
          if (nextValue) {
            yield nextValue;
            my.spriteState = nextValue;
          }
        }
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

  constructor(turnForDecay: Turn = Turn(96), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Peach) {
      let vector: SpriteIndex[] = [];
      while (true) {
        if (vector.length === 0) {
          if (my.turnForDecay <= 4)
            vector = [
              [0, 4],
              [0, 4],
              [0, 4],
              [0, 4],
            ];
          else
            vector = [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 1],
              [0, 1],
              [0, 1],
              [0, 1],
            ];
        }
        while (vector.length !== 0) {
          let nextValue = vector.shift();
          if (nextValue) {
            yield nextValue;
            my.spriteState = nextValue;
          }
        }
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

  constructor(turnForDecay: Turn = Turn(32), position: MapPosition = getRandomPosition()) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Fish) {
      let vector: SpriteIndex[] = [];
      while (true) {
        if (vector.length === 0) {
          if (my.turnForDecay <= 4)
            vector = [
              [0, 4],
              [0, 4],
              [0, 4],
              [0, 4],
            ];
          else
            vector = [
              [0, 0],
              [0, 1],
              [0, 2],
              [0, 3],
            ];
        }
        while (vector.length !== 0) {
          let nextValue = vector.shift();
          if (nextValue) {
            yield nextValue;
            my.spriteState = nextValue;
          }
        }
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
