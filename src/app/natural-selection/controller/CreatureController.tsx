"use client";

import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { CreatureRef, FoodRef, TileRef, createCreatureRef } from "../model/render";
import CreatureView from "../view/CreatureView";
import { CREATURE_SIZE, FRAME_TIME, TILE_SIZE, TURN_TIME } from "../model/constants";
import { CreatureState, CreatureType, Turn, getRandomPosition } from "../model/types";
import { Ggobugi, Isanghaessi, Pairi, Pikachu } from "../model/creature";
import { OverDecorateType, AboveDecorateType } from "../model/tile";
import { ScreenCoordinate } from "@/utils/physicalEngine";

interface Props {
  creatureRefs: MutableRefObject<CreatureRef[]>;
  foodRefs: MutableRefObject<FoodRef[]>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}

export default function CreatureController({ creatureRefs, foodRefs, sizeIndex, camPosRef }: Props) {
  useEffect(() => {
    const checkDelete = setInterval(() => {
      const newCreatureRefs: CreatureRef[] = [];
      creatureRefs.current?.forEach((v, i) => {
        if (!creatureRefs.current) return;
        if (v.data.delete === false) {
          newCreatureRefs.push(v);

          const creatureRefCur = v.mainRef.current;
          if (!creatureRefCur || sizeIndex.current === null) return;

          const size = CREATURE_SIZE[sizeIndex.current] * v.data.status.size;
          const offset = (TILE_SIZE[sizeIndex.current] - CREATURE_SIZE[sizeIndex.current]) / 2;
          // console.log(size + "px");
          creatureRefCur.style.width = `${size}px`;
          creatureRefCur.style.height = `${size}px`;
          creatureRefCur.style.transform = `translate(${offset}px, ${offset}px)`;
          creatureRefCur.style.backgroundSize = `${size * 4}px auto`;
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
              createCreatureRef(new Pikachu(v.data.makeChildStatus(), Turn(288), v.data.position))
            );
          } else if (v.data.creatureType === CreatureType.PAIRI) {
            creatureRefs.current.push(
              createCreatureRef(new Pairi(v.data.makeChildStatus(), Turn(288), v.data.position))
            );
          } else if (v.data.creatureType === CreatureType.ISANGHAESSI) {
            creatureRefs.current.push(
              createCreatureRef(new Isanghaessi(v.data.makeChildStatus(), Turn(288), v.data.position))
            );
          } else if (v.data.creatureType === CreatureType.GGOBUGI) {
            creatureRefs.current.push(
              createCreatureRef(new Ggobugi(v.data.makeChildStatus(), Turn(288), v.data.position))
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
      <CreatureView creatureRefs={creatureRefs} sizeIndex={sizeIndex} camPosRef={camPosRef} />
    </>
  );
}
