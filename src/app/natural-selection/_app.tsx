"use client";

import "./natsel.scss";

import { useEffect, useRef } from "react";
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
  TILE_SIZE,
  CREATURE_SIZE,
  MAP_SIZE,
} from "./model/constants";
import CreatureDataInspector from "./controller/CreatureDataInspector";
import { MapPosition } from "./model/types";

export default function NaturalSelection() {
  const flatTileRefs = useRef<TileRef<FlatTileType>[][]>([]);
  const aboveDecoRefs = useRef<Map<MapPosition, TileRef<AboveDecorateType>>>(createInitAboveDecoRefs());
  const overDecoRefs = useRef<Map<MapPosition, TileRef<OverDecorateType>>>(createInitOverDecoRefs());
  const creatureRefs = useRef<CreatureRef[]>([]);
  const foodRefs = useRef<FoodRef[]>([]);

  const sizeIndexRef = useRef<number>(0); // 0: 16, 1: 32, 2: 64

  useEffect(() => {
    initIndex();
    window.addEventListener("resize", initIndex);
    // setIndex();
    flatTileRefs.current = createInitFlatTileRefs();
    creatureRefs.current = createInitCreatureRefs();
    foodRefs.current = createInitFoodRefs();

    return () => {
      window.removeEventListener("resize", initIndex);
    };
  }, []);

  const initIndex = () => {
    if (window.innerHeight > window.innerWidth) {
      if (window.innerHeight > 1280) {
        sizeIndexRef.current = 2;
      } else if (window.innerHeight > 640) {
        sizeIndexRef.current = 1;
      } else {
        sizeIndexRef.current = 0;
      }
    } else {
      if (window.innerWidth > 1280) {
        sizeIndexRef.current = 2;
      } else if (window.innerWidth > 640) {
        sizeIndexRef.current = 1;
      } else {
        sizeIndexRef.current = 0;
      }
    }

    // console.log(resolutionIndexRef.current, sizeIndexRef.current);
    document.documentElement.style.setProperty("--map-size", `${MAP_SIZE}`);
    document.documentElement.style.setProperty("--tile-size", `${TILE_SIZE[sizeIndexRef.current]}px`);
    document.documentElement.style.setProperty("--creature-size", `${CREATURE_SIZE[sizeIndexRef.current]}px`);
  };

  return (
    <main>
      <div className="natsel-screen">
        <MapController
          flatTileRefs={flatTileRefs}
          aboveDecoRefs={aboveDecoRefs}
          overDecoRefs={overDecoRefs}
          sizeIndex={sizeIndexRef}
        />
        <FoodController foodRefs={foodRefs} sizeIndex={sizeIndexRef} />
        <CreatureController creatureRefs={creatureRefs} foodRefs={foodRefs} sizeIndex={sizeIndexRef} />
        <CreatureDataInspector creatureRefs={creatureRefs} />
      </div>
    </main>
  );
}
