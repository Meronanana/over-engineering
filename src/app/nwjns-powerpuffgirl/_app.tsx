"use client";

import { MouseEventHandler, RefObject, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import { BACKGROUND_BLUR, CHARACTER_SIZE, STAGE_HEIGHT, STAGE_WIDTH, STANDARD_HEIGHT } from "./model/constants";
import { NWJNSCharacter, Offsets, defaultCharacters } from "./model/types";
import { FPS_OFFSET } from "@/utils/constants";

import { Coordinate } from "@/utils/physicalEngine";
import { moveSequence } from "./utils/stream";
import { useSleep } from "@/utils/hooks";

import "./nwjns.scss";

export default function NWJNS_Powerpuffgirl() {
  const offsetRef = useRef<Offsets>({ stageWidth: 0, stageHeight: 0, charaSize: 0 });
  const stageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgTopRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgBottomRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgLeftRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgRightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const charaList = useRef<Array<NWJNSCharacter>>([...defaultCharacters]);

  useEffect(() => {
    initialize();
    window.addEventListener("resize", initialize);

    const moveInterval = setInterval(charaMove, FPS_OFFSET);

    {
      const frames = 50;
      const distShort = offsetRef.current.charaSize;
      const distLong = (distShort / 4) * 5;
      singleMove(0, { X: window.innerWidth * 0.15 - distShort, Y: window.innerHeight * 0.5 - distLong }, frames);
      singleMove(1, { X: window.innerWidth * 0.15, Y: window.innerHeight * 0.5 }, frames);
      singleMove(2, { X: window.innerWidth * 0.15 - distLong, Y: window.innerHeight * 0.5 + distShort }, frames);
      singleMove(3, { X: window.innerWidth * 0.15 + distLong, Y: window.innerHeight * 0.5 - distShort }, frames);
      singleMove(4, { X: window.innerWidth * 0.15 + distShort, Y: window.innerHeight * 0.5 + distLong }, frames);
    }

    return () => {
      window.removeEventListener("resize", initialize);
      clearInterval(moveInterval);
    };
  }, []);

  const initialize = () => {
    if (
      stageRef.current === null ||
      bgTopRef.current === null ||
      bgBottomRef.current === null ||
      bgLeftRef.current === null ||
      bgRightRef.current === null
    )
      return;

    document.documentElement.style.setProperty("--blur", `${BACKGROUND_BLUR}px`);

    for (let i = STANDARD_HEIGHT.length - 1; i >= 0; i--) {
      if (STANDARD_HEIGHT[i] >= window.innerHeight) continue;

      const horizonal = (window.innerWidth - STAGE_WIDTH[i]) / 2;
      const vertical = (window.innerHeight - STAGE_HEIGHT[i]) / 2;

      offsetRef.current.stageWidth = STAGE_WIDTH[i];
      offsetRef.current.stageHeight = STAGE_HEIGHT[i];
      offsetRef.current.charaSize = CHARACTER_SIZE[i];
      document.documentElement.style.setProperty("--chara-size", `${CHARACTER_SIZE[i]}px`);

      stageRef.current.style.width = STAGE_WIDTH[i] + "px";
      stageRef.current.style.height = STAGE_HEIGHT[i] + "px";

      bgTopRef.current.style.height = vertical + "px";
      bgBottomRef.current.style.height = vertical + "px";
      bgLeftRef.current.style.width = horizonal + "px";
      bgRightRef.current.style.width = horizonal + "px";

      bgTopRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";
      bgBottomRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";

      charaList.current.map((v) => {
        const charaRef = v.ref;
        if (charaRef.current === null) return;

        charaRef.current.style.width = CHARACTER_SIZE[i] + "px";
        charaRef.current.style.height = CHARACTER_SIZE[i] + "px";
      });

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
    const charaSize = offsetRef.current.charaSize;
    let seqNow;
    let i = 0;
    do {
      await useSleep(FPS_OFFSET);

      i++;
      seqNow = seq.next();

      if (start.X <= end.X) {
        if (i === 1) charaRef.current.style.backgroundPosition = `${-charaSize}px 0`;
        if (i === 10) charaRef.current.style.backgroundPosition = `${-charaSize * 0}px 0`;
        if (i === frames - 10) charaRef.current.style.backgroundPosition = `${-charaSize}px 0`;
        if (i === frames) charaRef.current.style.backgroundPosition = `${-charaSize * 2}px 0`;
      } else {
        if (i === 1) charaRef.current.style.backgroundPosition = `${-charaSize * 4}px 0`;
        if (i === 10) charaRef.current.style.backgroundPosition = `${-charaSize * 3}px 0`;
        if (i === frames - 10) charaRef.current.style.backgroundPosition = `${-charaSize * 4}px 0`;
        if (i === frames) charaRef.current.style.backgroundPosition = `${-charaSize * 5}px 0`;
      }

      charaPhysics.DST.X = seqNow.value.X;
      charaPhysics.DST.Y = seqNow.value.Y;
    } while (!seqNow.done);
  };

  const interactionInitialize = () => {
    const frames = 70;
    const distShort = offsetRef.current.charaSize;
    const distLong = (distShort / 4) * 5;

    if (stageRef.current) {
      stageRef.current.style.zIndex = "1";
    }

    singleMove(0, { X: window.innerWidth * 0.15 - distShort, Y: window.innerHeight * 0.5 - distLong }, frames);
    singleMove(1, { X: window.innerWidth * 0.15, Y: window.innerHeight * 0.5 }, frames);
    singleMove(2, { X: window.innerWidth * 0.15 - distLong, Y: window.innerHeight * 0.5 + distShort }, frames);
    singleMove(3, { X: window.innerWidth * 0.15 + distLong, Y: window.innerHeight * 0.5 - distShort }, frames);
    singleMove(4, { X: window.innerWidth * 0.15 + distShort, Y: window.innerHeight * 0.5 + distLong }, frames);

    setTimeout(() => {
      if (stageRef.current) {
        stageRef.current.style.zIndex = "0";
      }
    }, FPS_OFFSET * 70);
    // if (charaList.current[3].ref.current) {
    //   charaList.current[3].ref.current.style.backgroundPosition = `${-distShort * 3}px 0`;
    // }
  };

  const mouseClickEvent: MouseEventHandler = (e: React.MouseEvent) => {
    charaList.current.map((v, i) => {
      if (v.ref.current === null) return;
      singleMove(i, { X: v.ref.current.offsetLeft + window.innerWidth * 0.35, Y: v.ref.current.offsetTop });
    });
  };

  return (
    <main className="nwjns-screen">
      <div className="nwjns-stage" ref={stageRef} onClick={mouseClickEvent}></div>
      {charaList.current.map((v, i) => {
        return <div className={`chara-div ${v.name}`} ref={v.ref} key={`${i}div`}></div>;
      })}
      <div className="nwjns-background-blur top" ref={bgTopRef}></div>
      <div className="nwjns-background-blur bottom" ref={bgBottomRef}></div>
      <div className="nwjns-background-blur left" ref={bgLeftRef}></div>
      <div className="nwjns-background-blur right" ref={bgRightRef}></div>

      <Link href={"/sandbox"} className="temp">
        뒤로가기
      </Link>
      <div className="reset" onClick={interactionInitialize}>
        초기화
      </div>
    </main>
  );
}
