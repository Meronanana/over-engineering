"use client";

import { RefObject, useEffect, useState } from "react";
import { TileRef } from "../model/render";
import { AboveDecorateType, FlatTileType } from "../model/tile";

import "./tileView.scss";
import { FRAME_TIME, TILE_SIZE } from "../model/constants";

interface Props {
  tileRefs: RefObject<TileRef<FlatTileType>[][]>;
  sizeIndex: RefObject<number>;
}

export default function FlatTileView({ tileRefs, sizeIndex }: Props) {
  const [tiles, setTiles] = useState<TileRef<FlatTileType>[][]>();
  const [sizeIdx, setSizeIdx] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("resize", renderTile);

    setTimeout(() => {
      renderTile();
      if (tileRefs.current) setTiles(tileRefs.current);
    }, FRAME_TIME);

    return () => {
      window.removeEventListener("resize", renderTile);
    };
  }, []);

  const renderTile = () => {
    if (sizeIndex.current === null) return;
    setSizeIdx(sizeIndex.current);
  };

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
                style={{ top: `${i * TILE_SIZE[sizeIdx]}px`, left: `${iA * TILE_SIZE[sizeIdx]}px` }}
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
