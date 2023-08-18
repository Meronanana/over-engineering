"use client";

import { MouseEventHandler, MutableRefObject, RefObject, useRef } from "react";
import Link from "next/link";
import Toy from "./components/toy";

import "./sandbox.scss";
import { lerp } from "@/utils/mathEngine";

interface ArrayPair<T> {
  X: Array<T>;
  Y: Array<T>;
}

export default function Sandbox() {
  const screenRef: RefObject<HTMLElement> | null = useRef<HTMLElement>(null);
  const toyRef: RefObject<HTMLDivElement> | null = useRef<HTMLDivElement>(null);
  const accelate: RefObject<ArrayPair<number>> = useRef<ArrayPair<number>>({
    X: [],
    Y: [],
  });
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);

  const toyMove = (startX: number, startY: number, endX: number, endY: number, t?: number) => {
    if (toyRef.current !== null && screenRef.current !== null && accelate.current !== null) {
      if (screenRef.current.offsetWidth < endX) {
        endX = screenRef.current.offsetWidth * 2 - endX;
        accelate.current.X = accelate.current.X.map((v) => -v);
      } else if (endX < 0) {
        endX = -endX;
        accelate.current.X = accelate.current.X.map((v) => -v);
      }

      if (screenRef.current.offsetHeight * 0.8 < endY) {
        endY = screenRef.current.offsetHeight * 0.8;
      }

      // toyRef.current.style.left = lerp(startX, endX, t) + "px";
      // toyRef.current.style.top = lerp(startY, endY, t) + "px";
      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";
    }
  };

  const toyGravityDrop = (vy?: number) => {
    if (!accelate.current) return;

    let startX, startY, vx;
    startX = toyRef.current ? toyRef.current.offsetLeft : 0;
    startY = toyRef.current ? toyRef.current.offsetTop : 0;

    vx = Math.floor(accelate.current.X.reduce((sum, cur) => sum + cur, 0) / 10);
    vy = vy !== undefined ? vy : Math.floor(accelate.current.Y.reduce((sum, cur) => sum + cur, 0) / 10);

    toyMove(startX, startY, startX + vx, startY + vy, 0.1);

    startX += vx;
    startY += vy;
    vy += 5;

    if (vy < 30 || startY < 0) {
      setTimeout(toyGravityDrop, 1000 / 60, vy);
    }
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;
      toyGravityDrop();
    }
  };

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;

    const startX = toyRef.current ? toyRef.current.offsetLeft : 0;
    const startY = toyRef.current ? toyRef.current.offsetTop : 0;
    const moveX = e.movementX;
    const moveY = e.movementY;

    if (accelate.current !== null) {
      accelate.current.X.push(moveX);
      accelate.current.Y.push(moveY);
      if (accelate.current.X.length > 5) {
        accelate.current.X.shift();
        accelate.current.Y.shift();
      }
      console.log(accelate.current.X);
    }

    toyMove(startX, startY, startX + moveX, startY + moveY, 0.1);

    // console.log(toyRef);
  };

  return (
    <main
      className="sandbox-screen"
      onMouseLeave={mouseUpEvent}
      onMouseUp={mouseUpEvent}
      onMouseMove={mouseMoveEvent}
      ref={screenRef}
    >
      <Link href="/">HIHII</Link>
      <Toy toyRef={toyRef} mouseDownRef={mouseDownRef} />
    </main>
  );
}
