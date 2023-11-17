import { RefObject, useEffect, useRef, useState } from "react";
import { AboveDecorateType } from "../model/tile";
import { TileRef } from "../model/render";
import { MapPosition } from "../model/types";
import { FRAME_TIME, TILE_SIZE } from "../model/constants";
import { ScreenCoordinate } from "@/utils/physicalEngine";

interface Props {
  tileRefs: RefObject<Map<MapPosition, TileRef<AboveDecorateType>>>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}

export default function AboveDecoView({ tileRefs, sizeIndex, camPosRef }: Props) {
  const [tiles, setTiles] = useState<Map<MapPosition, TileRef<AboveDecorateType>>>();

  const areaRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);

    const camMove = setInterval(() => {
      if (!areaRef.current || !camPosRef.current) return;

      areaRef.current.style.top = `-${camPosRef.current.Y}px`;
      areaRef.current.style.left = `-${camPosRef.current.X}px`;
    }, FRAME_TIME);

    return () => {
      clearInterval(camMove);
    };
  }, []);

  const renderTiles = () => {
    const result: JSX.Element[] = [];
    tiles?.forEach((v, k) => {
      if (sizeIndex.current === null) return;
      result.push(
        <div
          className={`above-deco tile-${v.data.tileType}`}
          ref={v.mainRef}
          key={v.id}
          style={{ top: `${k.Y * TILE_SIZE[sizeIndex.current]}px`, left: `${k.X * TILE_SIZE[sizeIndex.current]}px` }}
        ></div>
      );
    });
    return result;
  };

  return (
    <div className="above-deco-area" ref={areaRef}>
      {...renderTiles()}
    </div>
  );
}
