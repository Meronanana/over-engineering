import { TileRef, createStaticTileRef } from "./render";
import { MapTile, StaticTileType } from "./tile";

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
