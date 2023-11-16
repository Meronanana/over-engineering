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
}

export default function MapController({ flatTileRefs, aboveDecoRefs, overDecoRefs }: Props) {
  if (flatTileRefs.current) {
    // staticTileRefs.current.push(new Array(20));
    // staticTileRefs.current[0][0] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    // console.log(staticTileRefs.current);
  }
  return (
    <>
      <FlatTileView tileRefs={flatTileRefs} />
      <AboveDecoView tileRefs={aboveDecoRefs} />
      <FloatingTileView tileRefs={overDecoRefs} />
    </>
  );
}
