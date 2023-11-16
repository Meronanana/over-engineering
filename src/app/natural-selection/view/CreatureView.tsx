"use client";

import { RefObject, useEffect, useState } from "react";
import { CreatureRef, TileRef } from "../model/render";

import "./creatureView.scss";
import { TILE_SIZE, FRAME_TIME, TURN_TIME, UNPASSALBE, CREATURE_SIZE } from "../model/constants";
import { OverDecorateType, AboveDecorateType } from "../model/tile";
import { Frame, MapPosition, getDistance } from "../model/types";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
}
export default function CreatureView({ creatureRefs }: Props) {
  const [creatures, setCreatures] = useState<CreatureRef[]>();

  useEffect(() => {
    if (!creatureRefs.current) return;
    setCreatures(creatureRefs.current);

    const renderInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      setCreatures(creatureRefs.current);
    }, TURN_TIME);

    const animateInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      creatureRefs.current.forEach((v) => {
        let idx = v.data.spriteIndexGenerator.next().value;

        if (!v.mainRef.current) return;
        let ix = CREATURE_SIZE * v.data.spriteState[1];
        let iy = CREATURE_SIZE * v.data.spriteState[0];
        v.mainRef.current.style.backgroundPosition = `-${ix}px -${iy}px`;
      });
    }, FRAME_TIME * Frame(6));

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
      clearInterval(animateInterval);
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
