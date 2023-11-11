"use client";

import { RefObject, useRef } from "react";
import { TileRef } from "../model/render";
import { FloatingTileType, MapTile, StaticTileType } from "../model/tile";
import StaticTileView from "../view/StaticTileView";
import FloatingTileView from "../view/FloatingTileView";

// import "./natsel.scss";

interface Props {
  staticTileRefs: RefObject<TileRef<StaticTileType>[][]>;
  floatingTileRefs: RefObject<TileRef<FloatingTileType>[][]>;
}

export default function MapController({ staticTileRefs, floatingTileRefs }: Props) {
  if (staticTileRefs.current) {
    // staticTileRefs.current.push(new Array(20));
    // staticTileRefs.current[0][0] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    // console.log(staticTileRefs.current);
  }
  return (
    <>
      <StaticTileView tileRefs={staticTileRefs} />
      <FloatingTileView tileRefs={floatingTileRefs} />
    </>
  );
}
