import { RefObject, createRef } from "react";
import { OverDecorateType, MapTile, AboveDecorateType, TileType, FlatTileType } from "./tile";
import { Creature, Food } from "./abstractItem";

export type TileRef<T extends TileType> = {
  id: string;
  data: MapTile<T>;
  mainRef: RefObject<HTMLDivElement>;
};

export const createFlatTileRef = (data: MapTile<FlatTileType>): TileRef<FlatTileType> => {
  return {
    id: `fl${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};
export const createAboveDecoRef = (data: MapTile<AboveDecorateType>): TileRef<AboveDecorateType> => {
  return {
    id: `ab${Math.random() * 1000000}`,
    data: data,
    mainRef: createRef(),
  };
};
export const createOverDecoRef = (data: MapTile<OverDecorateType>): TileRef<OverDecorateType> => {
  return {
    id: `ov${Math.random() * 1000000}`,
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
