import { Creature, CreatureType, Food, FoodType } from "./item";
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
import { MapPosition } from "./types";

export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 20;
export const TILE_SIZE = 30;

export const createInitalStaticTileRefs = (): TileRef<StaticTileType>[][] => {
  const result: TileRef<StaticTileType>[][] = [];

  for (let i = 0; i < MAP_WIDTH; i++) {
    result.push(new Array(MAP_HEIGHT));
    for (let j = 0; j < MAP_HEIGHT; j++) {
      result[i][j] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
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

  return result;
};

export const createInitialCreatureRefs = (): CreatureRef[] => {
  const result: CreatureRef[] = [];

  result.push(
    createCreatureRef(
      new Creature(
        CreatureType.PIKACHU,
        { speed: 1, size: 1, sense: 1 },
        64,
        { X: 15, Y: 10 },
        10,
        4,
        testIndexGenerator(),
        testPosGenerator()
      )
    )
  );

  return result;
};

export const createInitialFoodRefs = (): FoodRef[] => {
  const result: FoodRef[] = [];

  result.push(createFoodRef(new Food(FoodType.APPLE, 64, { X: 10, Y: 7 }, 10, 1, 1000, testIndexGenerator())));

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
