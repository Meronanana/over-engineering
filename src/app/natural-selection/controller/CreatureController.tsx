"use client";

import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { CreatureRef, FoodRef, createCreatureRef } from "../model/render";
import CreatureView from "../view/CreatureView";
import { FRAME_TIME, TURN_TIME } from "../model/constants";
import { CreatureState, CreatureType, Turn, getRandomPosition } from "../model/types";
import { Creature } from "../model/abstractItem";
import { Pikachu } from "../model/creature";

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
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current || !foodRefs.current) return;
        v.data.sensing(creatureRefs.current, foodRefs.current);
      });
    }, FRAME_TIME);

    const duplicate = setInterval(() => {
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current) return;
        if (v.data.creatureState === CreatureState.DUPLICATE) {
          if (v.data.creatureType === CreatureType.PIKACHU) {
            creatureRefs.current.push(
              createCreatureRef(new Pikachu(v.data.makeChildStatus(), Turn(192), v.data.position))
            );
          }
          v.data.creatureState = CreatureState.IDLE;
        }
      });
    }, TURN_TIME);

    return () => {
      clearInterval(checkDelete);
      clearInterval(sensingInterval);
      clearInterval(duplicate);
    };
  }, []);

  return (
    <>
      <CreatureView creatureRefs={creatureRefs} />
    </>
  );
}
