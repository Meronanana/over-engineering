"use client";

import { RefObject, useEffect, useState } from "react";
import { CreatureRef } from "../model/render";

import "./creatureView.scss";
import { TILE_SIZE } from "../model/constants";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
}
export default function CreatureView({ creatureRefs }: Props) {
  const [creatures, setCreatures] = useState<CreatureRef[]>();

  useEffect(() => {
    if (!creatureRefs.current) return;
    setCreatures(creatureRefs.current);
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
