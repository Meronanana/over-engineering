"use client";

import { MouseEventHandler, RefObject, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import { BACKGROUND_BLUR, STAGE_HEIGHT, STAGE_WIDTH, STANDARD_HEIGHT } from "./model/constants";
import { NWJNSCharacter, defaultCharacters } from "./model/types";
import { FPS_OFFSET } from "@/utils/constants";

import { Coordinate } from "@/utils/physicalEngine";
import { moveSequence } from "./utils/stream";
import { useSleep } from "@/utils/hooks";

import "./nwjns.scss";

export default function NWJNS_Powerpuffgirl() {
  const stageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgTopRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgBottomRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgLeftRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgRightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const charaList = useRef<Array<NWJNSCharacter>>([...defaultCharacters]);

  useEffect(() => {
    document.documentElement.style.setProperty("--blur", `${BACKGROUND_BLUR}px`);

    setBackground();
    window.addEventListener("resize", setBackground);

    const moveInterval = setInterval(charaMove, FPS_OFFSET);

    // charaList.current.map((v, i) =>
    //   singleMove(i, { X: window.innerWidth * 0.1 + 50 * i, Y: window.innerHeight * 0.4 + 100 * i }, 50)
    // );
    {
      const frames = 50;
      singleMove(0, { X: window.innerWidth * 0.15 - 50, Y: window.innerHeight * 0.5 - 100 }, frames);
      singleMove(1, { X: window.innerWidth * 0.15, Y: window.innerHeight * 0.5 }, frames);
      singleMove(2, { X: window.innerWidth * 0.15 - 50, Y: window.innerHeight * 0.5 + 100 }, frames);
      singleMove(3, { X: window.innerWidth * 0.15 + 50, Y: window.innerHeight * 0.5 - 100 }, frames);
      singleMove(4, { X: window.innerWidth * 0.15 + 50, Y: window.innerHeight * 0.5 + 100 }, frames);
    }

    return () => {
      window.removeEventListener("resize", setBackground);
      clearInterval(moveInterval);
    };
  }, []);

  const setBackground = () => {
    if (
      stageRef.current === null ||
      bgTopRef.current === null ||
      bgBottomRef.current === null ||
      bgLeftRef.current === null ||
      bgRightRef.current === null
    )
      return;

    for (let i = STANDARD_HEIGHT.length - 1; i >= 0; i--) {
      if (STANDARD_HEIGHT[i] >= window.innerHeight) continue;

      const horizonal = (window.innerWidth - STAGE_WIDTH[i]) / 2;
      const vertical = (window.innerHeight - STAGE_HEIGHT[i]) / 2;

      stageRef.current.style.width = STAGE_WIDTH[i] + "px";
      stageRef.current.style.height = STAGE_HEIGHT[i] + "px";

      bgTopRef.current.style.height = vertical + "px";
      bgBottomRef.current.style.height = vertical + "px";
      bgLeftRef.current.style.width = horizonal + "px";
      bgRightRef.current.style.width = horizonal + "px";

      bgTopRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";
      bgBottomRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";

      break;
    }
  };

  const charaMove = useCallback(() => {
    charaList.current.forEach((v, i) => {
      const charaRef = v.ref;
      const charaPhysics = v.physics;
      if (charaRef.current === null) return;

      charaPhysics.HOVER.vy = charaPhysics.HOVER_SEQ.next().value;

      let endX = charaPhysics.DST.X + charaPhysics.HOVER.vx;
      let endY = charaPhysics.DST.Y + charaPhysics.HOVER.vy;

      charaRef.current.style.left = endX + "px";
      charaRef.current.style.top = endY + "px";
    });
  }, []);

  const singleMove = async (index: number, end: Coordinate, frames: number = 70) => {
    const charaRef = charaList.current[index].ref;
    const charaPhysics = charaList.current[index].physics;

    if (charaRef.current === null) return;
    const start = { X: charaRef.current.offsetLeft, Y: charaRef.current.offsetTop };
    const seq = moveSequence(start, end, frames);

    let seqNow;
    do {
      await useSleep(FPS_OFFSET);

      seqNow = seq.next();

      charaPhysics.DST.X = seqNow.value.X;
      charaPhysics.DST.Y = seqNow.value.Y;
    } while (!seqNow.done);
  };

  const mouseClickEvent: MouseEventHandler = (e: React.MouseEvent) => {
    charaList.current.map((v, i) => {
      if (v.ref.current === null) return;
      singleMove(i, { X: v.ref.current.offsetLeft + window.innerWidth * 0.35, Y: v.ref.current.offsetTop });
    });
  };

  return (
    <main className="nwjns-screen" onClick={mouseClickEvent}>
      <div className="nwjns-stage" ref={stageRef}></div>
      {charaList.current.map((v, i) => {
        return (
          <div className="chara-div" ref={v.ref} key={`${i}div`}>
            A
          </div>
        );
      })}
      <div className="nwjns-background-blur top" ref={bgTopRef}></div>
      <div className="nwjns-background-blur bottom" ref={bgBottomRef}></div>
      <div className="nwjns-background-blur left" ref={bgLeftRef}></div>
      <div className="nwjns-background-blur right" ref={bgRightRef}></div>

      <Link href={"/sandbox"} className="temp">
        뒤로가기
      </Link>
    </main>
  );
}
