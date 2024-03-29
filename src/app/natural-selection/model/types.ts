import { MAP_SIZE } from "./constants";

export enum CreatureType {
  UNDEF = "",
  PIKACHU = "pikachu",
  PAIRI = "pairi",
  ISANGHAESSI = "isanghaessi",
  GGOBUGI = "ggobugi",
}

export enum FoodType {
  UNDEF = "",
  APPLE = "apple",
  PEACH = "peach",
  FISH = "fish",
}

export enum CreatureState {
  IDLE = 0,
  SLEEP = 1,
  AVIOD_FROM_PREDATOR = 2,
  FIND_FOOD = 3,
  EAT_FOOD = 4,
  DUPLICATE = 5,
}

export type MoveInterupt = {
  type: CreatureState;
  pos: MapPosition;
};

export type AnimateInterupt = {
  type: CreatureState;
  from: MapPosition;
  to: MapPosition;
};

export type Status = {
  speed: number;
  size: number;
  sense: number;
};

export type MapPosition = {
  X: number;
  Y: number;
};

export type SpriteIndex = [number, number];

export const getDistance = (from: MapPosition, to: MapPosition): number => {
  return Math.sqrt(Math.pow(from.X - to.X, 2) + Math.pow(from.Y - to.Y, 2));
};

export const getRandomPosition = () => {
  return { X: Math.floor(Math.random() * (MAP_SIZE - 2) + 1), Y: Math.floor(Math.random() * (MAP_SIZE - 2) + 1) };
};

// Frame은 양의 정수
export type Frame = number extends `-${number}` ? never : number extends `${number}.${number}` ? never : number;
export const Frame = (frame: number): Frame => {
  try {
    if (frame < 0) throw new Error("Frame is not positive");
    if (frame !== Math.floor(frame)) throw new Error("Frame is not integer");
  } catch (err) {
    console.error(err);
  }
  return frame;
};

// Turn은 양의 정수
export type Turn = number extends `-${number}` ? never : number extends `${number}.${number}` ? never : number;
export const Turn = (turn: number): Frame => {
  try {
    if (turn < 0) throw new Error("Turn is not positive");
    if (turn !== Math.floor(turn)) throw new Error("Turn is not integer");
  } catch (err) {
    console.error(err);
  }
  return turn;
};
