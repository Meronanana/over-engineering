"use client";

import { RefObject, useEffect, useState } from "react";
import { TileRef } from "../model/render";
import { AboveDecorateType, FlatTileType } from "../model/tile";

import "./tileView.scss";
import { TILE_SIZE } from "../model/constants";

interface Props {
  tileRefs: RefObject<TileRef<FlatTileType>[][]>;
}

export default function FlatTileView({ tileRefs }: Props) {
  const [tiles, setTiles] = useState<TileRef<FlatTileType>[][]>();

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);
  }, []);

  return (
    <div className="flat-tile-area">
      {tiles !== undefined ? (
        tiles.map((vA, iA) => {
          return vA.map((v, i) => {
            return (
              <div
                className={`flat-tile tile-${v.data.tileType}`}
                ref={v.mainRef}
                key={v.id}
                style={{ top: `${i * TILE_SIZE}px`, left: `${iA * TILE_SIZE}px` }}
              ></div>
            );
          });
        })
      ) : (
        <></>
      )}
    </div>
  );
}
