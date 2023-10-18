"use client";

import { MouseEventHandler, RefObject, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import "./deadlock.scss";
import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH } from "./utils/constants";
import CarControl from "./components/CarControl";

export default function Deadlock() {
  const bgRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const sizeIndexRef = useRef(0);

  useEffect(() => {
    initializeBackground();
    window.addEventListener("resize", initializeBackground);

    return () => {
      window.removeEventListener("resize", initializeBackground);
    };
  }, []);

  const initializeBackground = () => {
    if (!bgRef.current) return;

    const screenRatio = window.innerWidth / window.innerHeight;

    if (screenRatio < 16 / 9) {
      for (let i = 0; i < BACKGROUND_HEIGHT.length; i++) {
        if (window.innerHeight <= BACKGROUND_HEIGHT[i]) {
          sizeIndexRef.current = i;
          break;
        }
      }
    } else {
      for (let i = 0; i < BACKGROUND_WIDTH.length; i++) {
        if (window.innerWidth <= BACKGROUND_WIDTH[i]) {
          sizeIndexRef.current = i;
          break;
        }
      }
    }
    bgRef.current.style.width = BACKGROUND_WIDTH[sizeIndexRef.current] + "px";
    bgRef.current.style.height = BACKGROUND_HEIGHT[sizeIndexRef.current] + "px";
  };

  return (
    <main className="deadlock-screen">
      <div className="deadlock-background" ref={bgRef} />
      <div className="deadlock-top-menu">
        <div className="score" />
        <div className="traffic-light" />
      </div>
      <CarControl />
      <Link href={"/sandbox-alt"} className="temp">
        뒤로가기
      </Link>
    </main>
  );
}
