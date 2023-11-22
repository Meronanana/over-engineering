"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { CreatureRef, TileRef } from "../model/render";

import "./creatureView.scss";
import { TILE_SIZE, FRAME_TIME, TURN_TIME, CREATURE_SIZE } from "../model/constants";
import { Frame, MapPosition, getDistance } from "../model/types";
import { ScreenCoordinate } from "@/utils/physicalEngine";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
  sizeIndex: RefObject<number>;
  camPosRef: RefObject<ScreenCoordinate>;
}
export default function CreatureView({ creatureRefs, sizeIndex, camPosRef }: Props) {
  const [creatures, setCreatures] = useState<CreatureRef[]>();

  const areaRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!creatureRefs.current) return;
    setCreatures(creatureRefs.current);

    const camMove = setInterval(() => {
      if (!areaRef.current || !camPosRef.current) return;

      areaRef.current.style.top = `-${camPosRef.current.Y}px`;
      areaRef.current.style.left = `-${camPosRef.current.X}px`;
    }, FRAME_TIME);

    const renderInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      setCreatures(creatureRefs.current);
    }, FRAME_TIME * Frame(6));

    const animateInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      creatureRefs.current.forEach((v) => {
        let idx = v.data.spriteIndexGenerator.next().value;

        if (!v.mainRef.current || sizeIndex.current === null) return;
        let ix = CREATURE_SIZE[sizeIndex.current] * v.data.status.size * v.data.spriteState[1];
        let iy = CREATURE_SIZE[sizeIndex.current] * v.data.status.size * v.data.spriteState[0];
        v.mainRef.current.style.backgroundPosition = `-${ix}px -${iy}px`;
      });
    }, FRAME_TIME * Frame(6));

    const moveInterval = setInterval(() => {
      if (!creatureRefs.current) return;
      creatureRefs.current.forEach((v) => {
        let pos = v.data.screenPosGenerator.next().value;

        if (!v.mainRef.current || sizeIndex.current === null) return;
        v.mainRef.current.style.top = `${v.data.position.Y * TILE_SIZE[sizeIndex.current]}px`;
        v.mainRef.current.style.left = `${v.data.position.X * TILE_SIZE[sizeIndex.current]}px`;
      });
    }, FRAME_TIME);

    return () => {
      clearInterval(camMove);
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
        console.log("Life: " + data.currentAge + "/" + data.maxAge);
        console.log("Position: ");
        console.log(data.position);
        console.log("Status: ");
        console.log(data.status);
        console.log("------------------------------");
      }
    });
  };

  return (
    <div className="creature-area" ref={areaRef} onMouseDown={mouseDownEvent}>
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
