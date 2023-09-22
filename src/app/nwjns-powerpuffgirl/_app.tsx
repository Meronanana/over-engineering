"use client";

import { RefObject, useEffect, useRef } from "react";
import Link from "next/link";

import { BACKGROUND_BLUR, STAGE_HEIGHT, STAGE_WIDTH, STANDARD_HEIGHT } from "./model/constants";
import { NWJNSCharacter, defaultCharacters } from "./model/types";
import { FPS_OFFSET } from "@/utils/constants";

import "./nwjns.scss";

export default function NWJNS_Powerpuffgirl() {
  const stageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgTopRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgBottomRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgLeftRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgRightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const charaRef = useRef<Array<NWJNSCharacter>>([...defaultCharacters]);

  useEffect(() => {
    document.documentElement.style.setProperty("--blur", `${BACKGROUND_BLUR}px`);

    setBackground();
    window.addEventListener("resize", setBackground);

    const hoverInterval = setInterval(charaHovering, FPS_OFFSET);

    return () => {
      window.removeEventListener("resize", setBackground);
      clearInterval(hoverInterval);
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

      // console.log(i, horizonal, vertical);

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

  const charaHovering = () => {
    charaRef.current.map((v) => {
      const charaRef = v.ref;

      if (charaRef.current === null) return;

      const nowY = charaRef.current.offsetTop;

      charaRef.current.style.top = nowY + (v.hover.next().value as number) + "px";
    });
  };

  return (
    <main>
      <div className="nwjns-stage" ref={stageRef}></div>
      {charaRef.current.map((v, i) => {
        return (
          <div className="chara-div" ref={v.ref}>
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
