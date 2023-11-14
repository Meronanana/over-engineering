import { RefObject, createRef } from "react";
import { FloatingTileType, MapTile, StaticTileType } from "./tile";
import { Creature, Food } from "./abstractItem";

export type TileRef<T extends StaticTileType | FloatingTileType> = {
  id: string;
  data: MapTile<T>;
  mainRef: RefObject<HTMLDivElement>;
};

export const createStaticTileRef = (data: MapTile<StaticTileType>): TileRef<StaticTileType> => {
  return {
    id: `st${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};
export const createFloatingTileRef = (data: MapTile<FloatingTileType>): TileRef<FloatingTileType> => {
  return {
    id: `ft${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};

export type CreatureRef = {
  id: string;
  data: Creature;
  mainRef: RefObject<HTMLDivElement>;
};

export const createCreatureRef = (data: Creature): CreatureRef => {
  return {
    id: `c${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};

export type FoodRef = {
  id: string;
  data: Food;
  mainRef: RefObject<HTMLDivElement>;
};

export const createFoodRef = (data: Food): FoodRef => {
  return {
    id: `f${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};
