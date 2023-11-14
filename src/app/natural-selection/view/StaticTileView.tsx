"use client";

import { RefObject, useEffect, useState } from "react";
import { TileRef } from "../model/render";
import { StaticTileType } from "../model/tile";

import "./tileView.scss";
import { TILE_SIZE } from "../model/constants";

interface Props {
  tileRefs: RefObject<TileRef<StaticTileType>[][]>;
}

export default function StaticTileView({ tileRefs }: Props) {
  const [tiles, setTiles] = useState<TileRef<StaticTileType>[][]>();

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);
  }, []);

  return (
    <div className="static-tile-div">
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
            return (
              <div
                className={`static-tile-${v.data.tileType}`}
                ref={v.mainRef}
                key={`${0}${i}`}
                id={v.id}
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
