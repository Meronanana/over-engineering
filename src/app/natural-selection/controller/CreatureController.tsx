"use client";

import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { CreatureRef, FoodRef } from "../model/render";
import CreatureView from "../view/CreatureView";
import { FRAME_TIME } from "../model/constants";

// import "./natsel.scss";

interface Props {
  creatureRefs: MutableRefObject<CreatureRef[]>;
  foodRefs: MutableRefObject<FoodRef[]>;
}

export default function CreatureController({ creatureRefs, foodRefs }: Props) {
  useEffect(() => {
    const checkDelete = setInterval(() => {
      const newCreatureRefs: CreatureRef[] = [];
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current) return;
        if (v.data.delete === false) {
          newCreatureRefs.push(v);
        }
      });
      creatureRefs.current = newCreatureRefs;
    }, FRAME_TIME);

    const sensingInterval = setInterval(() => {
      const newCreatureRefs: CreatureRef[] = [];
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current || !foodRefs.current) return;
        v.data.sensing(creatureRefs.current, foodRefs.current);
        if (v.data.delete === false) {
          newCreatureRefs.push(v);
        }
      });
      // console.log(foodRefs.current);
      creatureRefs.current = newCreatureRefs;
    }, FRAME_TIME);

    return () => {
      clearInterval(checkDelete);
      clearInterval(sensingInterval);
    };
  }, []);

  return (
    <>
      <CreatureView creatureRefs={creatureRefs} />
    </>
  );
}
