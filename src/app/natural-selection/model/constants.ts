import { Ggobugi, Isanghaessi, Pairi, Pikachu } from "./creature";
import {
  CreatureRef,
  FoodRef,
  TileRef,
  createCreatureRef,
  createOverDecoRef,
  createFoodRef,
  createAboveDecoRef,
  createFlatTileRef,
} from "./render";
import { OverDecorateType, MapTile, AboveDecorateType, FlatTileType } from "./tile";
import { CreatureType, FoodType, MapPosition, Turn, getRandomPosition } from "./types";
import { Apple, Fish, Peach } from "./food";

export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 20;
export const TILE_SIZE = 32;
export const CREATURE_SIZE = 40;
export const FRAME_TIME = 1000 / 24;
export const TURN_TIME = FRAME_TIME * 48; // 2sec
export const SEASON_TIME = TURN_TIME * 16; // 32sec
export const GENERATION_TIME = SEASON_TIME * 4; // 128sec

export const UNPASSALBE: MapPosition[] = [];

export const createInitFlatTileRefs = (): TileRef<FlatTileType>[][] => {
  const result: TileRef<FlatTileType>[][] = [];

  for (let i = 0; i < MAP_WIDTH; i++) {
    result.push(new Array(MAP_HEIGHT));
    for (let j = 0; j < MAP_HEIGHT; j++) {
      result[i][j] = createFlatTileRef(new MapTile(FlatTileType.Plain_BASE1));
    }
  }

  return result;
};

export const createInitAboveDecoRefs = (): Map<MapPosition, TileRef<AboveDecorateType>> => {
  const result: Map<MapPosition, TileRef<AboveDecorateType>> = new Map();

  result.set({ X: 4, Y: 5 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT1)));
  result.set({ X: 21, Y: 7 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT1)));
  result.set({ X: 15, Y: 16 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT2)));

  UNPASSALBE.push({ X: 4, Y: 5 });
  UNPASSALBE.push({ X: 21, Y: 7 });
  UNPASSALBE.push({ X: 15, Y: 16 });

  return result;
};

export const createInitOverDecoRefs = (): Map<MapPosition, TileRef<OverDecorateType>> => {
  const result: Map<MapPosition, TileRef<OverDecorateType>> = new Map();

  result.set({ X: 4, Y: 5 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES1)));
  result.set({ X: 21, Y: 7 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES1)));
  result.set({ X: 15, Y: 16 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES2)));

  return result;
};

export const createInitCreatureRefs = (): CreatureRef[] => {
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

export const createInitFoodRefs = (): FoodRef[] => {
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
