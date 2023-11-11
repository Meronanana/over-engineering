"use client";

import "./natsel.scss";

import { useRef } from "react";
import CreatureController from "./controller/CreatureController";
import FoodController from "./controller/FoodController";
import MapController from "./controller/MapController";
import { CreatureRef, FoodRef, TileRef } from "./model/render";
import { FloatingTileType, StaticTileType } from "./model/tile";
import {
  createInitalFloatingTileRefs,
  createInitalStaticTileRefs,
  createInitialCreatureRefs,
  createInitialFoodRefs,
} from "./model/constants";

export default function NaturalSelection() {
  const staticTileRefs = useRef<TileRef<StaticTileType>[][]>(createInitalStaticTileRefs());
  const floatingTileRefs = useRef<TileRef<FloatingTileType>[][]>(createInitalFloatingTileRefs());
  const creatureRefs = useRef<CreatureRef[]>(createInitialCreatureRefs());
  const foodRefs = useRef<FoodRef[]>(createInitialFoodRefs());

  return (
    <main>
      <div className="natsel-screen">
        <MapController staticTileRefs={staticTileRefs} floatingTileRefs={floatingTileRefs} />
        <CreatureController creatureRefs={creatureRefs} />
        <FoodController foodRefs={foodRefs} />
      </div>
    </main>
  );
}
