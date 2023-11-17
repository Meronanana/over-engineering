"use client";

import { RefObject, useRef } from "react";
import { TileRef } from "../model/render";
import { OverDecorateType, MapTile, AboveDecorateType, FlatTileType } from "../model/tile";
import FlatTileView from "../view/FlatTileView";
import FloatingTileView from "../view/OverDecoView";
import { MapPosition } from "../model/types";
import AboveDecoView from "../view/AboveDecoView";

// import "./natsel.scss";

interface Props {
  flatTileRefs: RefObject<TileRef<FlatTileType>[][]>;
  aboveDecoRefs: RefObject<Map<MapPosition, TileRef<AboveDecorateType>>>;
  overDecoRefs: RefObject<Map<MapPosition, TileRef<OverDecorateType>>>;
  sizeIndex: RefObject<number>;
}

export default function MapController({ flatTileRefs, aboveDecoRefs, overDecoRefs, sizeIndex }: Props) {
  if (flatTileRefs.current) {
    // staticTileRefs.current.push(new Array(20));
    // staticTileRefs.current[0][0] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    // console.log(staticTileRefs.current);
  }
  // console.log(sizeIndex.current);
  return (
    <>
      <FlatTileView tileRefs={flatTileRefs} sizeIndex={sizeIndex} />
      <AboveDecoView tileRefs={aboveDecoRefs} sizeIndex={sizeIndex} />
      <FloatingTileView tileRefs={overDecoRefs} sizeIndex={sizeIndex} />
    </>
  );
}
