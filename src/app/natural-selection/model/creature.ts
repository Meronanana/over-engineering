import { Creature } from "./item";
import { CreatureType, Frame, Status, Turn, getDistance } from "./types";
import { MapPosition } from "./types";

export class Pikachu extends Creature {
  creatureType: CreatureType = CreatureType.PIKACHU;
  numOfState: number = 4;

  constructor(status: Status, turnForLife: Turn, position: MapPosition) {
    super(status, turnForLife, position);
    this.status = status;
    this.turnForLife = turnForLife;

    this.spriteIndexGenerator = (function* () {
      while (true) {
        yield 1;
      }
    })();

    this.screenPosGenerator = (function* (my: Pikachu) {
      let from: MapPosition = my.position;
      let to: MapPosition = { X: 20, Y: 15 };

      while (true) {
        let vector: MapPosition[] = [];
        let distance = getDistance(from, to);
        // console.log("두번도냐?  " + distance);

        let dx = to.X - from.X;
        let dy = to.Y - from.Y;
        let count = Math.floor((Frame(24) * distance) / status.speed);
        for (let i = 1; i <= count; i++) {
          vector.push({ X: from.X + (dx * i) / count, Y: from.Y + (dy * i) / count });
        }

        while (vector.length !== 0) {
          let nextValue = vector.shift();
          if (nextValue) {
            // console.log(from, to, nextValue);
            my.position = nextValue;
            yield nextValue;
          }
        }

        from = to;
        if (to.X === 20 && to.Y === 15) {
          to = { X: 20, Y: 5 };
        } else if (to.X === 20 && to.Y === 5) {
          to = { X: 9, Y: 5 };
        } else if (to.X === 9 && to.Y === 5) {
          to = { X: 9, Y: 15 };
        } else if (to.X === 9 && to.Y === 15) {
          to = { X: 20, Y: 15 };
        }
      }
    })(this);
  }

  asdfsdf = () => {
    this.position;
  };
}
