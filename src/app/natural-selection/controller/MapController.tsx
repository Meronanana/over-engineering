"use client";

import { useRef } from "react";
import { TileRef } from "../model/render";
import { FloatingTileType, MapTile, StaticTileType } from "../model/tile";
import { createInitalStaticTileRefs } from "../model/constants";
import StaticTileView from "../view/StaticTileView";

// import "./natsel.scss";

export default function MapController() {
  const staticTileRefs = useRef<TileRef<StaticTileType>[][]>(createInitalStaticTileRefs());
  const floatingTileRefs = useRef<TileRef<FloatingTileType>[][]>();

  if (staticTileRefs.current) {
    // staticTileRefs.current.push(new Array(20));
    // staticTileRefs.current[0][0] = createStaticTileRef(new MapTile(StaticTileType.Plain_BASE));
    console.log(staticTileRefs.current);
  }
  return (
    <>
      <StaticTileView tileRefs={staticTileRefs} />
    </>
  );
}
