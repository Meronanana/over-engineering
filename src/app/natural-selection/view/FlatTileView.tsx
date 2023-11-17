"use client";

import "./tileView.scss";

import { RefObject, useEffect, useRef, useState } from "react";
import { TileRef } from "../model/render";
import { AboveDecorateType, FlatTileType } from "../model/tile";

import { FRAME_TIME, TILE_SIZE } from "../model/constants";
import { ScreenCoordinate } from "@/utils/physicalEngine";

interface Props {
  tileRefs: RefObject<TileRef<FlatTileType>[][]>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}

export default function FlatTileView({ tileRefs, sizeIndex, camPosRef }: Props) {
  const [tiles, setTiles] = useState<TileRef<FlatTileType>[][]>();
  const [sizeIdx, setSizeIdx] = useState<number>(0);

  const areaRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("resize", renderTile);

    setTimeout(() => {
      renderTile();
      if (tileRefs.current) setTiles(tileRefs.current);
    }, FRAME_TIME);

    const camMove = setInterval(() => {
      if (!areaRef.current || !camPosRef.current) return;

      areaRef.current.style.top = `-${camPosRef.current.Y}px`;
      areaRef.current.style.left = `-${camPosRef.current.X}px`;
    }, FRAME_TIME);

    return () => {
      window.removeEventListener("resize", renderTile);
      clearInterval(camMove);
    };
  }, []);

  const renderTile = () => {
    if (sizeIndex.current === null) return;
    setSizeIdx(sizeIndex.current);
  };

  return (
    <div className="flat-tile-area" ref={areaRef}>
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
