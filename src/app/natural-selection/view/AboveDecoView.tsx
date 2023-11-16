import { RefObject, useEffect, useState } from "react";
import { AboveDecorateType } from "../model/tile";
import { TileRef } from "../model/render";
import { MapPosition } from "../model/types";
import { TILE_SIZE } from "../model/constants";

interface Props {
  tileRefs: RefObject<Map<MapPosition, TileRef<AboveDecorateType>>>;
}

export default function AboveDecoView({ tileRefs }: Props) {
  const [tiles, setTiles] = useState<Map<MapPosition, TileRef<AboveDecorateType>>>();

  useEffect(() => {
    if (!tileRefs.current) return;
    setTiles(tileRefs.current);
  }, []);

  const renderTiles = () => {
    const result: JSX.Element[] = [];
    tiles?.forEach((v, k) => {
      result.push(
        <div
          className={`above-deco tile-${v.data.tileType}`}
          ref={v.mainRef}
          key={v.id}
          style={{ top: `${k.Y * TILE_SIZE}px`, left: `${k.X * TILE_SIZE}px` }}
        ></div>
      );
    });
    return result;
  };

  return <div className="above-deco-area">{...renderTiles()}</div>;
}
