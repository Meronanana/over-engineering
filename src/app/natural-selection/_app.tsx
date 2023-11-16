"use client";

import "./natsel.scss";

import { useRef } from "react";
import CreatureController from "./controller/CreatureController";
import FoodController from "./controller/FoodController";
import MapController from "./controller/MapController";
import { CreatureRef, FoodRef, TileRef } from "./model/render";
import { OverDecorateType, AboveDecorateType, FlatTileType } from "./model/tile";
import {
  createInitOverDecoRefs,
  createInitFlatTileRefs,
  createInitCreatureRefs,
  createInitFoodRefs,
  createInitAboveDecoRefs,
} from "./model/constants";
import CreatureDataInspector from "./controller/CreatureDataInspector";
import { MapPosition } from "./model/types";

export default function NaturalSelection() {
  const flatTileRefs = useRef<TileRef<FlatTileType>[][]>(createInitFlatTileRefs());
  const aboveDecoRefs = useRef<Map<MapPosition, TileRef<AboveDecorateType>>>(createInitAboveDecoRefs());
  const overDecoRefs = useRef<Map<MapPosition, TileRef<OverDecorateType>>>(createInitOverDecoRefs());
  const creatureRefs = useRef<CreatureRef[]>(createInitCreatureRefs());
  const foodRefs = useRef<FoodRef[]>(createInitFoodRefs());

  return (
    <main>
      <div className="natsel-screen">
        <MapController flatTileRefs={flatTileRefs} aboveDecoRefs={aboveDecoRefs} overDecoRefs={overDecoRefs} />
        <FoodController foodRefs={foodRefs} />
        <CreatureController creatureRefs={creatureRefs} foodRefs={foodRefs} />
        <CreatureDataInspector creatureRefs={creatureRefs} />
      </div>
    </main>
  );
}
