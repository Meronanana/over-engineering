"use client";

import { JSX, RefObject, useEffect, useState } from "react";
import { TileRef } from "../model/render";
import { OverDecorateType } from "../model/tile";

import "./tileView.scss";
import { TILE_SIZE } from "../model/constants";
import { MapPosition } from "../model/types";

interface Props {
  tileRefs: RefObject<Map<MapPosition, TileRef<OverDecorateType>>>;
}

export default function OverDecoView({ tileRefs }: Props) {
  const [tiles, setTiles] = useState<Map<MapPosition, TileRef<OverDecorateType>>>();

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);
  }, []);

  const renderTiles = () => {
    const result: JSX.Element[] = [];
    tiles?.forEach((v, k) => {
      result.push(
        <div
          className={`over-deco tile-${v.data.tileType}`}
          ref={v.mainRef}
          key={v.id}
          style={{ top: `${k.Y * TILE_SIZE}px`, left: `${k.X * TILE_SIZE}px` }}
        ></div>
      );
    });
    return result;
  };

  return <div className="over-deco-area">{...renderTiles()}</div>;
}
