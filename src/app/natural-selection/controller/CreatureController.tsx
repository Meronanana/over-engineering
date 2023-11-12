"use client";

import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { CreatureRef, FoodRef } from "../model/render";
import CreatureView from "../view/CreatureView";
import { aFRAME } from "../model/constants";

// import "./natsel.scss";

interface Props {
  creatureRefs: MutableRefObject<CreatureRef[]>;
  foodRefs: MutableRefObject<FoodRef[]>;
}

export default function CreatureController({ creatureRefs, foodRefs }: Props) {
  useEffect(() => {
    const sensingInterval = setInterval(() => {
      const newCreatureRefs: CreatureRef[] = [];
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current || !foodRefs.current) return;
        v.data.sensing(creatureRefs.current, foodRefs.current);
        if (v.data.eaten === false) {
          newCreatureRefs.push(v);
        }
      });
      creatureRefs.current = newCreatureRefs;
    }, aFRAME);

    return () => {
      clearInterval(sensingInterval);
    };
  }, []);

  return (
    <>
      <CreatureView creatureRefs={creatureRefs} />
    </>
  );
}
