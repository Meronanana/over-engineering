import { Ggobugi, Isanghaessi, Pairi, Pikachu } from "./creature";
import { Creature, Food } from "./abstractItem";
import {
  CreatureRef,
  FoodRef,
  TileRef,
  createCreatureRef,
  createFloatingTileRef,
  createFoodRef,
  createStaticTileRef,
} from "./render";
import { FloatingTileType, MapTile, StaticTileType } from "./tile";
import { CreatureType, FoodType, MapPosition, Turn, getRandomPosition } from "./types";
import { Apple, Fish, Peach } from "./food";

export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 20;
export const TILE_SIZE = 30;
export const FRAME_TIME = 1000 / 24;
export const TURN_TIME = FRAME_TIME * 48; // 2sec
export const SEASON_TIME = TURN_TIME * 16; // 32sec
export const GENERATION_TIME = SEASON_TIME * 4; // 128sec

export const UNPASSALBE: MapPosition[] = [];

export const createInitalStaticTileRefs = (): TileRef<StaticTileType>[][] => {
  const result: TileRef<StaticTileType>[][] = [];

  for (let i = 0; i < MAP_WIDTH; i++) {
    result.push(new Array(MAP_HEIGHT));
    for (let j = 0; j < MAP_HEIGHT; j++) {
      result[i][j] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    }
  }

  result[4][5] = createStaticTileRef(new MapTile(StaticTileType.TreeRoot_BASE));
  result[21][7] = createStaticTileRef(new MapTile(StaticTileType.TreeRoot_BASE));
  result[15][16] = createStaticTileRef(new MapTile(StaticTileType.TreeRoot_BASE));

  for (let i = 0; i < MAP_WIDTH; i++) {
    for (let j = 0; j < MAP_HEIGHT; j++) {
      if (result[i][j].data.tileType.toString().charAt(2) === "1") {
        UNPASSALBE.push({ X: i, Y: j });
      }
    }
  }

  return result;
};

export const createInitalFloatingTileRefs = (): TileRef<FloatingTileType>[][] => {
  const result: TileRef<FloatingTileType>[][] = [];

  for (let i = 0; i < MAP_WIDTH; i++) {
    result.push(new Array(MAP_HEIGHT));
    for (let j = 0; j < MAP_HEIGHT; j++) {
      result[i][j] = createFloatingTileRef(new MapTile(FloatingTileType.BLANK));
    }
  }

  result[3][2] = createFloatingTileRef(new MapTile(FloatingTileType.TreeLeaves_BASE));
  result[20][4] = createFloatingTileRef(new MapTile(FloatingTileType.TreeLeaves_BASE));
  result[14][13] = createFloatingTileRef(new MapTile(FloatingTileType.TreeLeaves_BASE));

  return result;
};

export const createInitialCreatureRefs = (): CreatureRef[] => {
  const result: CreatureRef[] = [];

  result.push(createCreatureRef(new Pikachu()));
  result.push(createCreatureRef(new Pikachu()));
  result.push(createCreatureRef(new Pairi()));
  result.push(createCreatureRef(new Pairi()));
  result.push(createCreatureRef(new Isanghaessi()));
  result.push(createCreatureRef(new Isanghaessi()));
  result.push(createCreatureRef(new Ggobugi()));
  result.push(createCreatureRef(new Ggobugi()));

  return result;
};

export const createInitialFoodRefs = (): FoodRef[] => {
  const result: FoodRef[] = [];

  result.push(createFoodRef(new Apple()));
  result.push(createFoodRef(new Apple()));
  result.push(createFoodRef(new Apple()));
  result.push(createFoodRef(new Peach()));
  result.push(createFoodRef(new Peach()));
  result.push(createFoodRef(new Peach()));
  result.push(createFoodRef(new Fish()));
  result.push(createFoodRef(new Fish()));
  result.push(createFoodRef(new Fish()));

  return result;
};

function* testIndexGenerator(): Generator<number, never, number> {
  while (true) {
    yield 0;
  }
}

function* testPosGenerator(): Generator<MapPosition, never, MapPosition> {
  while (true) {
    yield { X: 5, Y: 5 };
  }
}
