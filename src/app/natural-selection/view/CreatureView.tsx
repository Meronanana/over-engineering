"use client";

import { RefObject, useEffect, useState } from "react";
import { CreatureRef } from "../model/render";

import "./creatureView.scss";
import { TILE_SIZE, aFRAME } from "../model/constants";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
}
export default function CreatureView({ creatureRefs }: Props) {
  const [creatures, setCreatures] = useState<CreatureRef[]>();

  useEffect(() => {
    if (!creatureRefs.current) return;
    setCreatures(creatureRefs.current);

    const moveInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      creatureRefs.current.forEach((v) => {
        let pos = v.data.screenPosGenerator.next();
        if (!v.mainRef.current) return;
        v.mainRef.current.style.top = `${v.data.position.Y * TILE_SIZE}px`;
        v.mainRef.current.style.left = `${v.data.position.X * TILE_SIZE}px`;
      });
    }, aFRAME);

    return () => {
      clearInterval(moveInterval);
    };
  }, []);

  const mouseDownEvent = (e: React.MouseEvent) => {
    const str = (e.target as HTMLDivElement).id;
    if (!creatureRefs.current || str === "") return;

    const focus = Number(str.substring(0, str.length - 8));
    const data = creatureRefs.current[focus].data;

    console.log("------------------------------");
    console.log("Type: " + data.creatureType);
    console.log("Gain: " + data.gain);
    console.log("Position: ");
    console.log(data.position);
    console.log("Status: ");
    console.log(data.status);
    console.log("------------------------------");
  };

  return (
    <div className="creature-area" onMouseDown={mouseDownEvent}>
      {creatures !== undefined ? (
        creatures.map((v, i) => {
          return (
            <div
              className={`creature-${v.data.creatureType}`}
              ref={v.mainRef}
              key={`${i}creature`}
              id={`${i}creature`}
            ></div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
