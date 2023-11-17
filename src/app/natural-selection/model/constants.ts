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

export const MAP_SIZE = 40;
export const TILE_SIZE = [16, 32, 64];
export const CREATURE_SIZE = [20, 40, 80];
export const FRAME_TIME = 1000 / 24;
export const TURN_TIME = FRAME_TIME * 48; // 2sec
export const SEASON_TIME = TURN_TIME * 16; // 32sec
export const GENERATION_TIME = SEASON_TIME * 4; // 128sec

export const UNPASSALBE: MapPosition[] = [];

export const createInitFlatTileRefs = (): TileRef<FlatTileType>[][] => {
  const result: TileRef<FlatTileType>[][] = [];

  for (let i = 0; i < MAP_SIZE; i++) {
    result.push(new Array(MAP_SIZE));
    for (let j = 0; j < MAP_SIZE; j++) {
      let k = Math.random();
      if (k < 0.01) {
        result[i][j] = createFlatTileRef(new MapTile(FlatTileType.Plain_ROCK));
      } else if (k < 0.02) {
        result[i][j] = createFlatTileRef(new MapTile(FlatTileType.Plain_GRASS));
      } else if (k < 0.1) {
        result[i][j] = createFlatTileRef(new MapTile(FlatTileType.Plain_BASE1));
      } else {
        result[i][j] = createFlatTileRef(new MapTile(FlatTileType.Plain_BASE2));
      }
    }
  }

  // TODO: GRASS 생성 알고리즘 만들기
  result[18][6] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT_TOP));
  result[19][6] = createFlatTileRef(new MapTile(FlatTileType.Grass_TOP));
  result[20][6] = createFlatTileRef(new MapTile(FlatTileType.Grass_TOP));
  result[21][6] = createFlatTileRef(new MapTile(FlatTileType.Grass_TOP));
  result[22][6] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT_TOP));

  result[18][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT));
  result[19][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[20][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[21][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[22][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_INNER_RIGHT_TOP));
  result[23][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_TOP));
  result[24][7] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT_TOP));

  result[16][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT_TOP));
  result[17][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_TOP));
  result[18][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_INNER_LEFT_TOP));
  result[19][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[20][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_INNER_RIGHT_BOTTOM));
  result[21][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_INNER_LEFT_BOTTOM));
  result[22][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[23][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_BASE));
  result[24][8] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT));

  result[16][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT_BOTTOM));
  result[17][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_BOTTOM));
  result[18][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_BOTTOM));
  result[19][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_BOTTOM));
  result[20][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT_BOTTOM));
  result[21][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT_BOTTOM));
  result[22][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_BOTTOM));
  result[23][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_INNER_LEFT_BOTTOM));
  result[24][9] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT));

  result[23][10] = createFlatTileRef(new MapTile(FlatTileType.Grass_LEFT_BOTTOM));
  result[24][10] = createFlatTileRef(new MapTile(FlatTileType.Grass_RIGHT_BOTTOM));
  // TODO: 수작업은 좀 아닌 것 같습니다

  return result;
};

export const createInitAboveDecoRefs = (): Map<MapPosition, TileRef<AboveDecorateType>> => {
  const result: Map<MapPosition, TileRef<AboveDecorateType>> = new Map();

  result.set({ X: 8, Y: 23 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT1)));
  result.set({ X: 21, Y: 7 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT1)));
  result.set({ X: 31, Y: 32 }, createAboveDecoRef(new MapTile(AboveDecorateType.Tree_ROOT2)));

  UNPASSALBE.push({ X: 8, Y: 23 });
  UNPASSALBE.push({ X: 21, Y: 7 });
  UNPASSALBE.push({ X: 31, Y: 32 });

  return result;
};

export const createInitOverDecoRefs = (): Map<MapPosition, TileRef<OverDecorateType>> => {
  const result: Map<MapPosition, TileRef<OverDecorateType>> = new Map();

  result.set({ X: 8, Y: 23 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES1)));
  result.set({ X: 21, Y: 7 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES1)));
  result.set({ X: 31, Y: 32 }, createOverDecoRef(new MapTile(OverDecorateType.Tree_LEAVES2)));

  return result;
};

export const createInitCreatureRefs = (): CreatureRef[] => {
  const result: CreatureRef[] = [];

  for (let i = 0; i < 3; i++) {
    result.push(createCreatureRef(new Pikachu()));
    result.push(createCreatureRef(new Pairi()));
    result.push(createCreatureRef(new Isanghaessi()));
    result.push(createCreatureRef(new Ggobugi()));
  }

  return result;
};

export const createInitFoodRefs = (): FoodRef[] => {
  const result: FoodRef[] = [];

  for (let i = 0; i < 3; i++) {
    result.push(createFoodRef(new Apple()));
    result.push(createFoodRef(new Peach()));
    result.push(createFoodRef(new Fish()));
  }

  return result;
};
