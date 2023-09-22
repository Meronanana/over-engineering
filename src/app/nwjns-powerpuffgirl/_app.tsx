"use client";

import { RefObject, useEffect, useRef } from "react";
import Link from "next/link";
import { BACKGROUND_BLUR, STAGE_HEIGHT, STAGE_WIDTH, STANDARD_HEIGHT } from "./model/constants";

import "./nwjns.scss";

export default function NWJNS_Powerpuffgirl() {
  const bgTopRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgBottomRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgLeftRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgRightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--blur", `${BACKGROUND_BLUR}px`);

    setBackground();
    window.addEventListener("resize", setBackground);

    return () => {
      window.removeEventListener("resize", setBackground);
    };
  }, []);

  const setBackground = () => {
    if (
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

      bgTopRef.current.style.height = vertical + "px";
      bgBottomRef.current.style.height = vertical + "px";
      bgLeftRef.current.style.width = horizonal + "px";
      bgRightRef.current.style.width = horizonal + "px";

      bgTopRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";
      bgBottomRef.current.style.width = STAGE_WIDTH[i] + 5 + "px";

      break;
    }
  };

  return (
    <main>
      <Link href={"/sandbox"} className="temp">
        뒤로가기
      </Link>
      <div className="nwjns-background-blur top" ref={bgTopRef}></div>
      <div className="nwjns-background-blur bottom" ref={bgBottomRef}></div>
      <div className="nwjns-background-blur left" ref={bgLeftRef}></div>
      <div className="nwjns-background-blur right" ref={bgRightRef}></div>
      <div></div>
    </main>
  );
}
