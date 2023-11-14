"use client";

import { RefObject, useEffect, useState } from "react";
import { CreatureRef, TileRef } from "../model/render";

import "./creatureView.scss";
import { TILE_SIZE, FRAME_TIME, TURN_TIME, UNPASSALBE } from "../model/constants";
import { FloatingTileType, StaticTileType } from "../model/tile";
import { MapPosition, getDistance } from "../model/types";

interface Props {
  staticTileRefs: RefObject<TileRef<StaticTileType>[][]>;
  floatingTileRefs: RefObject<TileRef<FloatingTileType>[][]>;
  creatureRefs: RefObject<CreatureRef[]>;
}
export default function CreatureView({ staticTileRefs, floatingTileRefs, creatureRefs }: Props) {
  const [creatures, setCreatures] = useState<CreatureRef[]>();

  useEffect(() => {
    if (!creatureRefs.current) return;
    setCreatures(creatureRefs.current);

    const renderInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      setCreatures(creatureRefs.current);
    }, TURN_TIME);

    const moveInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      creatureRefs.current.forEach((v) => {
        let pos = v.data.screenPosGenerator.next().value;

        if (!v.mainRef.current) return;
        v.mainRef.current.style.top = `${v.data.position.Y * TILE_SIZE}px`;
        v.mainRef.current.style.left = `${v.data.position.X * TILE_SIZE}px`;
      });
    }, FRAME_TIME);

    return () => {
      clearInterval(renderInterval);
      clearInterval(moveInterval);
    };
  }, []);

  const mouseDownEvent = (e: React.MouseEvent) => {
    const str = (e.target as HTMLDivElement).id;
    if (!creatureRefs.current || str === "") return;

    const focus = Number(str.substring(1));
    creatureRefs.current.forEach((v) => {
      if (v.id === str) {
        let data = v.data;

        console.log("------------------------------");
        console.log("Type: " + data.creatureType);
        console.log("Gain: " + data.gain);
        console.log("Position: ");
        console.log(data.position);
        console.log("Status: ");
        console.log(data.status);
        console.log("------------------------------");
      }
    });
  };

  return (
    <div className="creature-area" onMouseDown={mouseDownEvent}>
      {creatures !== undefined ? (
        creatures.map((v, i) => {
          return <div className={`creature ${v.data.creatureType}`} ref={v.mainRef} key={v.id} id={v.id}></div>;
        })
      ) : (
        <></>
      )}
    </div>
  );
}
