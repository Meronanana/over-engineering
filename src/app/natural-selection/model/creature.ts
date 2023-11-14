import { Creature } from "./abstractItem";
import { GENERATION_TIME, TURN_TIME } from "./constants";
import {
  CreatureType,
  Frame,
  CreatureState,
  Status,
  Turn,
  getDistance,
  getRandomPosition,
  MoveInterupt,
} from "./types";
import { MapPosition } from "./types";

export class Pikachu extends Creature {
  creatureType: CreatureType = CreatureType.PIKACHU;
  numOfSprite: number = 4;

  constructor(
    status: Status = { speed: 1.1, size: 0.9, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Pikachu) {
      while (true) {
        yield 1;
      }
    })(this);

    this.screenPosGenerator = (function* (my: Pikachu) {
      let from: MapPosition = my.position;
      let to: MapPosition = getRandomPosition();
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / my.status.speed);
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
              } else if (sign.type === CreatureState.EAT_FOOD || sign.type === CreatureState.DUPLICATE) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              }
              from = my.position;
              to = sign.pos;
              interupt = true;
              break;
            } else if (my.creatureState === CreatureState.DUPLICATE) {
              vector = [...Array(24)].map(() => {
                return my.position;
              });
              interupt = true;
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
  }
}

export class Pairi extends Creature {
  creatureType: CreatureType = CreatureType.PAIRI;
  numOfSprite: number = 4;

  constructor(
    status: Status = { speed: 0.8, size: 1.3, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Pairi) {
      while (true) {
        yield 1;
      }
    })(this);

    this.screenPosGenerator = (function* (my: Pairi) {
      let from: MapPosition = my.position;
      let to: MapPosition = getRandomPosition();
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / my.status.speed);
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
              } else if (sign.type === CreatureState.EAT_FOOD || sign.type === CreatureState.DUPLICATE) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              }
              from = my.position;
              to = sign.pos;
              interupt = true;
              break;
            } else if (my.creatureState === CreatureState.DUPLICATE) {
              vector = [...Array(24)].map(() => {
                return my.position;
              });
              interupt = true;
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
  }
}

export class Isanghaessi extends Creature {
  creatureType: CreatureType = CreatureType.ISANGHAESSI;
  numOfSprite: number = 4;

  constructor(
    status: Status = { speed: 0.8, size: 1, sense: 1.3 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Isanghaessi) {
      while (true) {
        yield 1;
      }
    })(this);

    this.screenPosGenerator = (function* (my: Isanghaessi) {
      let from: MapPosition = my.position;
      let to: MapPosition = getRandomPosition();
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / my.status.speed);
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
              } else if (sign.type === CreatureState.EAT_FOOD || sign.type === CreatureState.DUPLICATE) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              }
              from = my.position;
              to = sign.pos;
              interupt = true;
              break;
            } else if (my.creatureState === CreatureState.DUPLICATE) {
              vector = [...Array(24)].map(() => {
                return my.position;
              });
              interupt = true;
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
  }
}

export class Ggobugi extends Creature {
  creatureType: CreatureType = CreatureType.GGOBUGI;
  numOfSprite: number = 4;

  constructor(
    status: Status = { speed: 1, size: 1, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Ggobugi) {
      while (true) {
        yield 1;
      }
    })(this);

    this.screenPosGenerator = (function* (my: Ggobugi) {
      let from: MapPosition = my.position;
      let to: MapPosition = getRandomPosition();
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / my.status.speed);
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
              } else if (sign.type === CreatureState.EAT_FOOD || sign.type === CreatureState.DUPLICATE) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              }
              from = my.position;
              to = sign.pos;
              interupt = true;
              break;
            } else if (my.creatureState === CreatureState.DUPLICATE) {
              vector = [...Array(24)].map(() => {
                return my.position;
              });
              interupt = true;
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
  }
}
