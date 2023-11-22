import { getRadian } from "@/utils/physicalEngine";
import { Creature } from "./abstractItem";
import {
  SPRITES_EAT_LEFT,
  SPRITES_EAT_RIGHT,
  SPRITES_MOVE_DOWN,
  SPRITES_MOVE_LEFT,
  SPRITES_MOVE_RIGHT,
  SPRITES_MOVE_UP,
  SPRITES_SLEEP_LEFT,
  SPRITES_SLEEP_RIGHT,
} from "./animation";
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
    maxAge: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, maxAge, position);

    this.spriteIndexGenerator = (function* (my: Pikachu) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [...SPRITES_SLEEP_RIGHT];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...SPRITES_MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...SPRITES_MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...SPRITES_MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...SPRITES_MOVE_DOWN];
          } else {
            vector = [...SPRITES_MOVE_RIGHT];
          }
        }

        while (vector.length !== 0) {
          const nextValue = vector.shift();
          if (nextValue) {
            const sign = yield nextValue;
            if (sign !== undefined) {
              // console.log(sign);
              vector.unshift(nextValue);
              if (sign.type === CreatureState.IDLE) {
                direction = getRadian({ vx: sign.to.X - sign.from.X, vy: sign.to.Y - sign.from.Y }) % (Math.PI * 2);
              } else if (sign.type === CreatureState.EAT_FOOD) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_EAT_LEFT];
                } else {
                  vector = [...SPRITES_EAT_RIGHT];
                }
              } else if (sign.type === CreatureState.DUPLICATE) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT];
                }
              } else if (sign.type === CreatureState.SLEEP) {
                console.log("here");
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT];
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
      let vector: MapPosition[] = [...Array<MapPosition>(72).fill(my.position)];
      while (true) {
        let distance = getDistance(from, to);
        let aInterput: AnimateInterupt = { type: CreatureState.IDLE, from: from, to: to };
        my.spriteIndexGenerator.next(aInterput);

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
              console.log(sign);
              vector.unshift(nextValue);

              if (sign.type === CreatureState.AVIOD_FROM_PREDATOR) {
                vector = [];
              } else if (sign.type === CreatureState.FIND_FOOD) {
                vector = [];
              } else if (sign.type === CreatureState.EAT_FOOD || sign.type === CreatureState.DUPLICATE) {
                vector = [...Array(24)].map(() => {
                  return sign.pos;
                });
              } else if (sign.type === CreatureState.SLEEP) {
                vector = [...Array(72)].map(() => {
                  return my.position;
                });
                aInterput = { type: CreatureState.SLEEP, from: { X: -1, Y: -1 }, to: { X: -1, Y: -1 } };
                my.spriteIndexGenerator.next(aInterput);
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

    // console.log("?LL?L?L");
    // let mInterupt: MoveInterupt = { type: CreatureState.SLEEP, pos: { X: -1, Y: -1 } };
    // this.screenPosGenerator.next(mInterupt);
  }
}

export class Pairi extends Creature {
  creatureType: CreatureType = CreatureType.PAIRI;

  constructor(
    status: Status = { speed: 0.8, size: 1.3, sense: 1 },
    maxAge: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, maxAge, position);

    this.spriteIndexGenerator = (function* (my: Pairi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [...SPRITES_SLEEP_RIGHT];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...SPRITES_MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...SPRITES_MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...SPRITES_MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...SPRITES_MOVE_DOWN];
          } else {
            vector = [...SPRITES_MOVE_RIGHT];
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
                  vector = [...SPRITES_EAT_LEFT];
                } else {
                  vector = [...SPRITES_EAT_RIGHT];
                }
              } else if (sign.type === CreatureState.DUPLICATE) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT];
                }
              } else if (sign.type === CreatureState.SLEEP) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT, ...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT, ...SPRITES_SLEEP_RIGHT];
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
      let vector: MapPosition[] = [...Array<MapPosition>(72).fill(my.position)];
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

    let aInterupt: AnimateInterupt = { type: CreatureState.SLEEP, from: { X: -1, Y: -1 }, to: { X: -1, Y: -1 } };
    this.spriteIndexGenerator.next(aInterupt);
  }
}

export class Isanghaessi extends Creature {
  creatureType: CreatureType = CreatureType.ISANGHAESSI;

  constructor(
    status: Status = { speed: 0.8, size: 1, sense: 1.3 },
    maxAge: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, maxAge, position);

    this.spriteIndexGenerator = (function* (my: Isanghaessi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [...SPRITES_SLEEP_RIGHT];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...SPRITES_MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...SPRITES_MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...SPRITES_MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...SPRITES_MOVE_DOWN];
          } else {
            vector = [...SPRITES_MOVE_RIGHT];
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
                  vector = [...SPRITES_EAT_LEFT];
                } else {
                  vector = [...SPRITES_EAT_RIGHT];
                }
              } else if (sign.type === CreatureState.DUPLICATE) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT];
                }
              } else if (sign.type === CreatureState.SLEEP) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT, ...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT, ...SPRITES_SLEEP_RIGHT];
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
      let vector: MapPosition[] = [...Array<MapPosition>(72).fill(my.position)];
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

    let aInterupt: AnimateInterupt = { type: CreatureState.SLEEP, from: { X: -1, Y: -1 }, to: { X: -1, Y: -1 } };
    this.spriteIndexGenerator.next(aInterupt);
  }
}

export class Ggobugi extends Creature {
  creatureType: CreatureType = CreatureType.GGOBUGI;

  constructor(
    status: Status = { speed: 1, size: 1, sense: 1 },
    maxAge: Turn = Turn(288),
    position: MapPosition = getRandomPosition()
  ) {
    super(status, maxAge, position);

    this.spriteIndexGenerator = (function* (my: Ggobugi) {
      let direction: number = 0;
      let vector: SpriteIndex[] = [...SPRITES_SLEEP_RIGHT];

      while (true) {
        if (vector.length === 0) {
          if (direction < Math.PI / 3) {
            vector = [...SPRITES_MOVE_RIGHT];
          } else if (direction < (Math.PI * 2) / 3) {
            vector = [...SPRITES_MOVE_UP];
          } else if (direction < (Math.PI * 4) / 3) {
            vector = [...SPRITES_MOVE_LEFT];
          } else if (direction < (Math.PI * 5) / 3) {
            vector = [...SPRITES_MOVE_DOWN];
          } else {
            vector = [...SPRITES_MOVE_RIGHT];
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
                  vector = [...SPRITES_EAT_LEFT];
                } else {
                  vector = [...SPRITES_EAT_RIGHT];
                }
              } else if (sign.type === CreatureState.DUPLICATE) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT];
                }
              } else if (sign.type === CreatureState.SLEEP) {
                if (direction > Math.PI / 2 && direction < (Math.PI * 3) / 2) {
                  vector = [...SPRITES_SLEEP_LEFT, ...SPRITES_SLEEP_LEFT];
                } else {
                  vector = [...SPRITES_SLEEP_RIGHT, ...SPRITES_SLEEP_RIGHT];
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
      let vector: MapPosition[] = [...Array<MapPosition>(72).fill(my.position)];
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

    let aInterupt: AnimateInterupt = { type: CreatureState.SLEEP, from: { X: -1, Y: -1 }, to: { X: -1, Y: -1 } };
    this.spriteIndexGenerator.next(aInterupt);
  }
}
