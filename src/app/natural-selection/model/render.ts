import { RefObject, createRef } from "react";
import { FloatingTileType, MapTile, StaticTileType } from "./tile";
import { Creature, Food } from "./item";

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

export type CreatureRef = {
  data: Creature;
  mainRef: RefObject<HTMLDivElement>;
};

export const createCreatureRef = (data: Creature): CreatureRef => {
  return {
    data: data,
    mainRef: createRef(),
  };
};

export type FoodRef = {
  data: Food;
  mainRef: RefObject<HTMLDivElement>;
};

export const createFoodRef = (data: Food): FoodRef => {
  return {
    data: data,
    mainRef: createRef(),
  };
};
