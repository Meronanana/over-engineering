"use client";

import "./tileView.scss";

import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { TileRef } from "../model/render";
import { OverDecorateType } from "../model/tile";

import { FRAME_TIME, TILE_SIZE } from "../model/constants";
import { MapPosition } from "../model/types";
import { ScreenCoordinate } from "@/utils/physicalEngine";

interface Props {
  tileRefs: RefObject<Map<MapPosition, TileRef<OverDecorateType>>>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}

export default function OverDecoView({ tileRefs, sizeIndex, camPosRef }: Props) {
  const [tiles, setTiles] = useState<Map<MapPosition, TileRef<OverDecorateType>>>();
  const [sizeIdx, setSizeIdx] = useState<number>(0);

  const areaRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("resize", updateIndex);

    setTimeout(() => {
      updateIndex();
      if (tileRefs.current) setTiles(tileRefs.current);
    }, FRAME_TIME);

    const camMove = setInterval(() => {
      if (!areaRef.current || !camPosRef.current) return;

      areaRef.current.style.top = `-${camPosRef.current.Y}px`;
      areaRef.current.style.left = `-${camPosRef.current.X}px`;
    }, FRAME_TIME);

    return () => {
      window.removeEventListener("resize", updateIndex);
      clearInterval(camMove);
    };
  }, []);

  const updateIndex = () => {
    if (sizeIndex.current === null) return;
    setSizeIdx(sizeIndex.current);
  };

  const renderTiles = () => {
    const result: JSX.Element[] = [];
    tiles?.forEach((v, k) => {
      result.push(
        <div
          className={`over-deco tile-${v.data.tileType}`}
          ref={v.mainRef}
          key={v.id}
          style={{ top: `${k.Y * TILE_SIZE[sizeIdx]}px`, left: `${k.X * TILE_SIZE[sizeIdx]}px` }}
        ></div>
      );
    });
    return result;
  };

  return (
    <div className="over-deco-area" ref={areaRef}>
      {...renderTiles()}
    </div>
  );
}
