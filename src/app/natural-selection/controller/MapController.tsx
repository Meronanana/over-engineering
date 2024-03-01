"use client";

import { RefObject, useRef } from "react";
import { TileRef } from "../model/render";
import { OverDecorateType, MapTile, AboveDecorateType, FlatTileType } from "../model/tile";
import FlatTileView from "../view/FlatTileView";
import FloatingTileView from "../view/OverDecoView";
import { MapPosition } from "../model/types";
import AboveDecoView from "../view/AboveDecoView";
import { ScreenCoordinate } from "@/utils/physicalEngine";

// import "./natsel.scss";

interface Props {
  flatTileRefs: RefObject<TileRef<FlatTileType>[][]>;
  aboveDecoRefs: RefObject<Map<MapPosition, TileRef<AboveDecorateType>>>;
  overDecoRefs: RefObject<Map<MapPosition, TileRef<OverDecorateType>>>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}

export default function MapController({ flatTileRefs, aboveDecoRefs, overDecoRefs, sizeIndex, camPosRef }: Props) {
  if (flatTileRefs.current) {
    // staticTileRefs.current.push(new Array(20));
    // staticTileRefs.current[0][0] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    // console.log(staticTileRefs.current);
  }
  // console.log(sizeIndex.current);
  return (
    <>
      <FlatTileView tileRefs={flatTileRefs} sizeIndex={sizeIndex} camPosRef={camPosRef} />
      <AboveDecoView tileRefs={aboveDecoRefs} sizeIndex={sizeIndex} camPosRef={camPosRef} />
      <FloatingTileView tileRefs={overDecoRefs} sizeIndex={sizeIndex} camPosRef={camPosRef} />
    </>
  );
}
