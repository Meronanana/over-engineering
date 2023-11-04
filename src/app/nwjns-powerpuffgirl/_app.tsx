"use client";

import { MouseEventHandler, RefObject, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import {
  BACKGROUND_BLUR,
  CHARACTER_SIZE,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  STANDARD_HEIGHT,
  THRESHOLD_RATIO,
} from "./model/constants";
import { NWJNSCharacter, Offsets, defaultCharacters } from "./model/types";

import { ScreenType } from "@/utils/types";
import { FPS_OFFSET } from "@/utils/constants";
import { Coordinate } from "@/utils/physicalEngine";
import { moveSequence } from "./utils/stream";
import { getWindowRatio, sleep } from "@/utils/utilFunctions";

import "./nwjns.scss";

export default function NWJNS_Powerpuffgirl() {
  const offsetRef = useRef<Offsets>({ stageWidth: 0, stageHeight: 0, charaSize: 0, screenType: ScreenType.Normal });

  const stageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgTopRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgBottomRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgLeftRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgRightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const pageBlockRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const charaList = useRef<Array<NWJNSCharacter>>([...defaultCharacters]);

  useEffect(() => {
    console.log(window.navigator.userAgent);
    resizeInitialize();
    window.addEventListener("resize", resizeInitialize);

    const moveInterval = setInterval(charaMove, FPS_OFFSET);

    interactionInitialize(50);

    return () => {
      window.removeEventListener("resize", resizeInitialize);
      clearInterval(moveInterval);
    };
  }, []);

  const resizeInitialize = () => {
    if (
      stageRef.current === null ||
      bgTopRef.current === null ||
      bgBottomRef.current === null ||
      bgLeftRef.current === null ||
      bgRightRef.current === null
    )
      return;

    document.documentElement.style.setProperty("--blur", `${BACKGROUND_BLUR}px`);

    // 스크린 초기화
    for (let i = STANDARD_HEIGHT.length - 1; i >= 0; i--) {
      if (getWindowRatio() > 9 / 16) {
        if (STANDARD_HEIGHT[i] > window.innerHeight) continue;
      } else {
        if (STAGE_WIDTH[i] > window.innerWidth) continue;
      }
      if (i == 0 && pageBlockRef.current) {
        pageBlockRef.current.style.display = "flex";
      } else if (pageBlockRef.current) {
        pageBlockRef.current.style.display = "none";
      }

      const horGap = (window.innerWidth - STAGE_WIDTH[i]) / 2;
      const verGap = (window.innerHeight - STAGE_HEIGHT[i]) / 2;

      // 오프셋 설정
      offsetRef.current.stageWidth = STAGE_WIDTH[i];
      offsetRef.current.stageHeight = STAGE_HEIGHT[i];
      offsetRef.current.charaSize = CHARACTER_SIZE[i];

      // 배경 resolution
      stageRef.current.style.width = STAGE_WIDTH[i] + "px";
      stageRef.current.style.height = STAGE_HEIGHT[i] + "px";

      bgTopRef.current.style.height = verGap + "px";
      bgBottomRef.current.style.height = verGap + "px";
      bgLeftRef.current.style.width = horGap + "px";
      bgRightRef.current.style.width = horGap + "px";

      bgTopRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";
      bgBottomRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";

      // Character size
      document.documentElement.style.setProperty("--chara-size", `${CHARACTER_SIZE[i]}px`);
      charaList.current.forEach((v) => {
        if (v.ref.current) {
          v.ref.current.style.backgroundPosition = `${-CHARACTER_SIZE[i] * 2}px, 0`;
        }
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
      await sleep(FPS_OFFSET);

      i++;
      seqNow = seq.next();

      if (start.X <= end.X) {
        if (i === 1) charaRef.current.style.backgroundPosition = `${-charaSize * 1}px 0`;
        if (i === 10) charaRef.current.style.backgroundPosition = `${-charaSize * 0}px 0`;
        if (i === frames - 10) charaRef.current.style.backgroundPosition = `${-charaSize * 1}px 0`;
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

  const interactionInitialize = (frames: number = 70) => {
    const distShort = offsetRef.current.charaSize;
    const distLong = (distShort * 5) / 4;

    if (stageRef.current) {
      stageRef.current.style.zIndex = "1";
    }

    if (getWindowRatio() > THRESHOLD_RATIO) {
      singleMove(0, { X: window.innerWidth * 0.15 - distShort, Y: window.innerHeight * 0.5 - distLong }, frames);
      singleMove(1, { X: window.innerWidth * 0.15, Y: window.innerHeight * 0.5 }, frames);
      singleMove(2, { X: window.innerWidth * 0.15 - distLong, Y: window.innerHeight * 0.5 + distShort }, frames);
      singleMove(3, { X: window.innerWidth * 0.15 + distLong, Y: window.innerHeight * 0.5 - distShort }, frames);
      singleMove(4, { X: window.innerWidth * 0.15 + distShort, Y: window.innerHeight * 0.5 + distLong }, frames);
    } else {
      singleMove(0, { X: -window.innerWidth * 0.3 - distShort, Y: window.innerHeight * 0.5 - distLong }, frames);
      singleMove(1, { X: -window.innerWidth * 0.3, Y: window.innerHeight * 0.5 }, frames);
      singleMove(2, { X: -window.innerWidth * 0.3 - distLong, Y: window.innerHeight * 0.5 + distShort }, frames);
      singleMove(3, { X: -window.innerWidth * 0.3 + distLong, Y: window.innerHeight * 0.5 - distShort }, frames);
      singleMove(4, { X: -window.innerWidth * 0.3 + distShort, Y: window.innerHeight * 0.5 + distLong }, frames);
    }

    setTimeout(() => {
      if (stageRef.current) {
        stageRef.current.style.zIndex = "0";
      }
    }, FPS_OFFSET * frames);
  };

  const mouseClickEvent: MouseEventHandler = (e: React.MouseEvent) => {
    charaList.current.map((v, i) => {
      if (v.ref.current === null) return;

      if (getWindowRatio() > THRESHOLD_RATIO) {
        singleMove(i, { X: v.ref.current.offsetLeft + window.innerWidth * 0.35, Y: v.ref.current.offsetTop });
      } else {
        singleMove(i, { X: v.ref.current.offsetLeft + window.innerWidth * 0.8, Y: v.ref.current.offsetTop });
      }
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

      <Link href={"/sandbox-alt"} className="temp">
        뒤로가기
      </Link>
      <div className="reset" onClick={() => interactionInitialize()}>
        초기화
      </div>
      <div className="nwjns-not-support" ref={pageBlockRef}>{`Screen size is too small`}</div>
    </main>
  );
}
