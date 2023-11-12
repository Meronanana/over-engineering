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

  return (
    <div className="creature-div">
      {creatures !== undefined ? (
        creatures.map((v, i) => {
          return (
            <div
              className={`creature-${v.data.creatureType}`}
              ref={v.mainRef}
              key={`${0}${i}`}
              style={{ top: `${v.data.position.Y * TILE_SIZE}px`, left: `${v.data.position.X * TILE_SIZE}px` }}
            ></div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
