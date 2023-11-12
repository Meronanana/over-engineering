"use client";

import { RefObject, useEffect, useRef } from "react";
import { CreatureRef, FoodRef } from "../model/render";
import CreatureView from "../view/CreatureView";
import { aFRAME } from "../model/constants";

// import "./natsel.scss";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
  foodRefs: RefObject<FoodRef[]>;
}

export default function CreatureController({ creatureRefs, foodRefs }: Props) {
  useEffect(() => {
    const sensingInterval = setInterval(() => {
      creatureRefs.current?.forEach((v) => {
        if (!creatureRefs.current || !foodRefs.current) return;
        v.data.sensing(creatureRefs.current, foodRefs.current);
      });
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
