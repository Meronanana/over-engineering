"use client";

import { RefObject, useEffect, useState } from "react";
import { TileRef } from "../model/render";
import { FloatingTileType } from "../model/tile";

import "./tileView.scss";
import { TILE_SIZE } from "../model/constants";

interface Props {
  tileRefs: RefObject<TileRef<FloatingTileType>[][]>;
}

export default function FlotingTileView({ tileRefs }: Props) {
  const [tiles, setTiles] = useState<TileRef<FloatingTileType>[][]>();

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);
  }, []);

  return (
    <div className="floating-tile-area">
      {/* <div className={`static-tile-0000`}></div> */}

      {tiles !== undefined ? (
        // tiles[0].map((v, i) => {
        //   return (
        //     <div
        //       className={`static-tile-${v.data.tileType}`}
        //       ref={v.mainRef}
        //       key={`${0}${i}`}
        //       style={{ top: `${i * TILE_SIZE}px`, left: `0px` }}
        //     ></div>
        //   );
        // })
        tiles.map((vA, iA) => {
          return vA.map((v, i) => {
            return v.data.tileType !== FloatingTileType.BLANK ? (
              <div
                className={`floating-tile tile-${v.data.tileType}`}
                ref={v.mainRef}
                key={v.id}
                style={{ top: `${i * TILE_SIZE}px`, left: `${iA * TILE_SIZE}px` }}
              ></div>
            ) : null;
          });
        })
      ) : (
        <></>
      )}
    </div>
  );
}
