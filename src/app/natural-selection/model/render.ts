import { RefObject, createRef } from "react";
import { FloatingTileType, MapTile, StaticTileType } from "./tile";

export type TileRef<T extends StaticTileType | FloatingTileType> = {
  data: MapTile<T>;
  mainRef: RefObject<HTMLDivElement>;
};

export const createStaticTileRef = (data: MapTile<StaticTileType>): TileRef<StaticTileType> => {
  return {
    data: data,
    mainRef: createRef(),
  };
};
export const createFloatingTileRef = (data: MapTile<FloatingTileType>): TileRef<FloatingTileType> => {
  return {
    data: data,
    mainRef: createRef(),
  };
};
