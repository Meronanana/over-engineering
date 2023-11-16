import { getRadian } from "@/utils/physicalEngine";
import { Creature } from "./abstractItem";
import { EAT_LEFT, EAT_RIGHT, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP } from "./animation";
import { GENERATION_TIME, TURN_TIME, UNPASSALBE } from "./constants";
import {
  CreatureType,
  Frame,
  CreatureState,
  Status,
  Turn,
  getDistance,
  getRandomPosition,
  MoveInterupt,
  SpriteIndex,
  AnimateInterupt,
} from "./types";
import { MapPosition } from "./types";

export class Pikachu extends Creature {
  creatureType: CreatureType = CreatureType.PIKACHU;

  constructor(
    status: Status = { speed: 1.1, size: 0.9, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Pikachu) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...MOVE_DOWN];
          } else {
            vector = [...MOVE_RIGHT];
          }
        }

        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            const sign = yield nextValue;
            if (sign !== undefined) {
              vector.unshift(nextValue);
              if (sign.type === CreatureState.IDLE) {
                direction = getRadian({ vx: sign.to.X - sign.from.X, vy: sign.to.Y - sign.from.Y }) % (Math.PI * 2);
              } else if (sign.type === CreatureState.EAT_FOOD) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...EAT_LEFT];
                } else {
                  vector = [...EAT_RIGHT];
                }
              }

              break;
            } else {
              my.spriteState = nextValue;
            }
          }
        }
      }
    })(this);

    this.screenPosGenerator = (function* (my: Pikachu) {
      let from: MapPosition = my.position;
      let to: MapPosition = my.position;
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);
        let animateInterput: AnimateInterupt = { type: CreatureState.IDLE, from: from, to: to };
        my.spriteIndexGenerator.next(animateInterput);

        if (vector.length === 0) {
          // console.log("create?  " + distance);
          let dx = to.X - from.X;
          let dy = to.Y - from.Y;
          let count = Math.floor((Frame(24) * distance) / my.status.speed);
          for (let i = 1; i <= count; i++) {
            vector.push({ X: from.X + (dx * i) / count, Y: from.Y + (dy * i) / count });
          }
        }

        let interupt = false;
        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            let unpass = false;
            for (let i = 0; i < UNPASSALBE.length; i++) {
              if (getDistance(nextValue, UNPASSALBE[i]) < 1) {
                unpass = true;
                vector = [];
                break;
              }
            }
            if (unpass) break;

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

  constructor(
    status: Status = { speed: 0.8, size: 1.3, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Pairi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...MOVE_DOWN];
          } else {
            vector = [...MOVE_RIGHT];
          }
        }

        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            const sign = yield nextValue;
            if (sign !== undefined) {
              vector.unshift(nextValue);
              if (sign.type === CreatureState.IDLE) {
                direction = getRadian({ vx: sign.to.X - sign.from.X, vy: sign.to.Y - sign.from.Y }) % (Math.PI * 2);
              } else if (sign.type === CreatureState.EAT_FOOD) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...EAT_LEFT];
                } else {
                  vector = [...EAT_RIGHT];
                }
              }

              break;
            } else {
              my.spriteState = nextValue;
            }
          }
        }
      }
    })(this);

    this.screenPosGenerator = (function* (my: Pairi) {
      let from: MapPosition = my.position;
      let to: MapPosition = my.position;
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);
        let animateInterput: AnimateInterupt = { type: CreatureState.IDLE, from: from, to: to };
        my.spriteIndexGenerator.next(animateInterput);

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
            let unpass = false;
            for (let i = 0; i < UNPASSALBE.length; i++) {
              if (getDistance(nextValue, UNPASSALBE[i]) < 1) {
                unpass = true;
                vector = [];
                break;
              }
            }
            if (unpass) break;

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

  constructor(
    status: Status = { speed: 0.8, size: 1, sense: 1.3 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Isanghaessi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...MOVE_DOWN];
          } else {
            vector = [...MOVE_RIGHT];
          }
        }

        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            const sign = yield nextValue;
            if (sign !== undefined) {
              vector.unshift(nextValue);
              if (sign.type === CreatureState.IDLE) {
                direction = getRadian({ vx: sign.to.X - sign.from.X, vy: sign.to.Y - sign.from.Y }) % (Math.PI * 2);
              } else if (sign.type === CreatureState.EAT_FOOD) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...EAT_LEFT];
                } else {
                  vector = [...EAT_RIGHT];
                }
              }

              break;
            } else {
              my.spriteState = nextValue;
            }
          }
        }
      }
    })(this);

    this.screenPosGenerator = (function* (my: Isanghaessi) {
      let from: MapPosition = my.position;
      let to: MapPosition = my.position;
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);
        let animateInterput: AnimateInterupt = { type: CreatureState.IDLE, from: from, to: to };
        my.spriteIndexGenerator.next(animateInterput);

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
            let unpass = false;
            for (let i = 0; i < UNPASSALBE.length; i++) {
              if (getDistance(nextValue, UNPASSALBE[i]) < 1) {
                unpass = true;
                vector = [];
                break;
              }
            }
            if (unpass) break;

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

  constructor(
    status: Status = { speed: 1, size: 1, sense: 1 },
    turnForLife: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, turnForLife, position);

    this.spriteIndexGenerator = (function* (my: Ggobugi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...MOVE_DOWN];
          } else {
            vector = [...MOVE_RIGHT];
          }
        }

        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            const sign = yield nextValue;
            if (sign !== undefined) {
              vector.unshift(nextValue);
              if (sign.type === CreatureState.IDLE) {
                direction = getRadian({ vx: sign.to.X - sign.from.X, vy: sign.to.Y - sign.from.Y }) % (Math.PI * 2);
              } else if (sign.type === CreatureState.EAT_FOOD) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...EAT_LEFT];
                } else {
                  vector = [...EAT_RIGHT];
                }
              }

              break;
            } else {
              my.spriteState = nextValue;
            }
          }
        }
      }
    })(this);

    this.screenPosGenerator = (function* (my: Ggobugi) {
      let from: MapPosition = my.position;
      let to: MapPosition = my.position;
      let vector: MapPosition[] = [];
      while (true) {
        let distance = getDistance(from, to);
        let animateInterput: AnimateInterupt = { type: CreatureState.IDLE, from: from, to: to };
        my.spriteIndexGenerator.next(animateInterput);

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
            let unpass = false;
            for (let i = 0; i < UNPASSALBE.length; i++) {
              if (getDistance(nextValue, UNPASSALBE[i]) < 1) {
                unpass = true;
                vector = [];
                break;
              }
            }
            if (unpass) break;

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
