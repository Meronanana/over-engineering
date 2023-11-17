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
import { ScreenCoordinate } from "@/utils/physicalEngine";
import NatselController from "./components/NatselController";

export default function NaturalSelection() {
  const flatTileRefs = useRef<TileRef<FlatTileType>[][]>([]);
  const aboveDecoRefs = useRef<Map<MapPosition, TileRef<AboveDecorateType>>>(createInitAboveDecoRefs());
  const overDecoRefs = useRef<Map<MapPosition, TileRef<OverDecorateType>>>(createInitOverDecoRefs());
  const creatureRefs = useRef<CreatureRef[]>([]);
  const foodRefs = useRef<FoodRef[]>([]);

  const sizeIndexRef = useRef<number>(0); // 0: 16, 1: 32, 2: 64

  const mouseDownRef = useRef<boolean>(false);
  const camPosRef = useRef<ScreenCoordinate>({ X: 0, Y: 0 });
  const touchPosRef = useRef<ScreenCoordinate>({ X: 0, Y: 0 });

  useEffect(() => {
    initPage();
    window.addEventListener("resize", initPage);
    // setIndex();
    flatTileRefs.current = createInitFlatTileRefs();
    creatureRefs.current = createInitCreatureRefs();
    foodRefs.current = createInitFoodRefs();

    return () => {
      window.removeEventListener("resize", initPage);
    };
  }, []);

  const initPage = () => {
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

  const mouseDownEvent = () => {
    mouseDownRef.current = true;
  };
  const touchStartEvent = (e: React.TouchEvent) => {
    mouseDownRef.current = true;
    touchPosRef.current = { X: e.touches[0].clientX, Y: e.touches[0].clientY };
  };

  const mouseUpEvent = () => {
    mouseDownRef.current = false;
  };
  const touchEndEvent = mouseUpEvent;

  const mouseMoveEvent = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;

    const newX = camPosRef.current.X - e.movementX;
    const newY = camPosRef.current.Y - e.movementY;
    const limitX = MAP_SIZE * TILE_SIZE[sizeIndexRef.current] - window.innerWidth;
    const limitY = MAP_SIZE * TILE_SIZE[sizeIndexRef.current] - window.innerHeight;

    if (newX < 0) camPosRef.current.X = 0;
    else if (newX > limitX) camPosRef.current.X = limitX;
    else camPosRef.current.X = newX;

    if (newY < 0) camPosRef.current.Y = 0;
    else if (newY > limitY) camPosRef.current.Y = limitY;
    else camPosRef.current.Y = newY;
  };

  const touchMoveEvent = (e: React.TouchEvent) => {
    if (!mouseDownRef.current) return;

    const newX = camPosRef.current.X - e.touches[0].clientX + touchPosRef.current.X;
    const newY = camPosRef.current.Y - e.touches[0].clientY + touchPosRef.current.Y;
    const limitX = MAP_SIZE * TILE_SIZE[sizeIndexRef.current] - window.innerWidth;
    const limitY = MAP_SIZE * TILE_SIZE[sizeIndexRef.current] - window.innerHeight;

    if (newX < 0) camPosRef.current.X = 0;
    else if (newX > limitX) camPosRef.current.X = limitX;
    else camPosRef.current.X = newX;

    if (newY < 0) camPosRef.current.Y = 0;
    else if (newY > limitY) camPosRef.current.Y = limitY;
    else camPosRef.current.Y = newY;

    touchPosRef.current = { X: e.touches[0].clientX, Y: e.touches[0].clientY };
  };

  return (
    <main>
      <div
        className="natsel-screen"
        onMouseDown={mouseDownEvent}
        onMouseMove={mouseMoveEvent}
        onMouseUp={mouseUpEvent}
        onMouseLeave={mouseUpEvent}
        onTouchStart={touchStartEvent}
        onTouchEnd={touchEndEvent}
        onTouchMove={touchMoveEvent}
      >
        <MapController
          flatTileRefs={flatTileRefs}
          aboveDecoRefs={aboveDecoRefs}
          overDecoRefs={overDecoRefs}
          sizeIndex={sizeIndexRef}
          camPosRef={camPosRef}
        />
        <FoodController foodRefs={foodRefs} sizeIndex={sizeIndexRef} camPosRef={camPosRef} />
        <CreatureController
          creatureRefs={creatureRefs}
          foodRefs={foodRefs}
          sizeIndex={sizeIndexRef}
          camPosRef={camPosRef}
        />
        <CreatureDataInspector creatureRefs={creatureRefs} />
        <NatselController />
      </div>
    </main>
  );
}
