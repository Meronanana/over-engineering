import { Creature } from "./abstractItem";
import { GENERATION_TIME, TURN_TIME } from "./constants";
import { CreatureType, Frame, CreatureState, Status, Turn, getDistance, getRandomPosition } from "./types";
import { MapPosition } from "./types";

export class Pikachu extends Creature {
  creatureType: CreatureType = CreatureType.PIKACHU;
  numOfSprite: number = 4;

  constructor(status: Status, turnForLife: Turn, position: MapPosition) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Pikachu) {
      while (true) {
        yield 1;
      }
    })(this);

    this.screenPosGenerator = (function* (my: Pikachu) {
      let from: MapPosition = my.position;
      let to: MapPosition = { X: 11, Y: 6 };
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / status.speed);
          for (let i = 1; i <= count; i++) {
            vector.push({ X: from.X + (dx * i) / count, Y: from.Y + (dy * i) / count });
          }
        }
        // console.log(vector);

        let interupt = false;
        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            // console.log(from, to, nextValue);
            const sign = yield nextValue;
            if (sign !== undefined) {
              vector.unshift(nextValue);

              if (sign.type === CreatureState.AVIOD_FROM_PREDATOR) {
                vector = [];
              } else if (sign.type === CreatureState.FIND_FOOD) {
                vector = [];
              } else if (sign.type === CreatureState.EAT_FOOD) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              }
              from = my.position;
              to = sign.pos;
              interupt = true;
              break;
            } else {
              my.position = nextValue;
            }
          }
        }
        // console.log(from, to);
        if (interupt) continue;
        my.creatureState = CreatureState.IDLE;

        from = my.position;
        let tmp = getRandomPosition();
        while (getDistance(from, tmp) > my.status.speed * 3) {
          tmp = getRandomPosition();
        }
        to = tmp;
      }
    })(this);

    const decTurnForLife = setInterval(() => {
      if (this.turnForLife === 0) {
        // Die
        this.delete = true;
        clearInterval(decTurnForLife);
        return;
      }
      this.turnForLife -= 1;
    }, TURN_TIME);

    const generationEnd = setInterval(() => {
      const baseCost = this.getBasecost();
      if (this.gain > baseCost) {
        const chance = (this.gain - baseCost) / baseCost;
        if (chance > Math.random()) {
          // Duplicate
        }
      } else {
        const chance = this.gain / baseCost;
        if (chance > Math.random()) {
          // Survive
        } else {
          // Die
          this.delete = true;
          clearInterval(generationEnd);
        }
      }
    }, GENERATION_TIME);
  }
}
