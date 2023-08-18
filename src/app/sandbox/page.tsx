"use client";

import { MouseEventHandler, MutableRefObject, RefObject, useRef } from "react";
import Link from "next/link";
import Toy from "./components/toy";

import "./sandbox.scss";
import { lerp } from "@/utils/physicalEngine";

interface ArrayPair<T> {
  X: Array<T>;
  Y: Array<T>;
}

export default function Sandbox() {
  const screenRef: RefObject<HTMLElement> | null = useRef<HTMLElement>(null);
  const toyRef: RefObject<HTMLDivElement> | null = useRef<HTMLDivElement>(null);
  const toyDst = useRef({ X: -1, Y: -1 });
  const accelate: RefObject<ArrayPair<number>> = useRef<ArrayPair<number>>({
    X: [],
    Y: [],
  });
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);

  const moveKey = useRef<NodeJS.Timer>();

  const toyMove = (t?: number) => {
    if (toyRef.current !== null && screenRef.current !== null && accelate.current !== null) {
      let startX = toyRef.current.offsetLeft;
      let startY = toyRef.current.offsetTop;
      let endX = toyDst.current.X;
      let endY = toyDst.current.Y;

      if (t !== undefined) {
        endX = Math.round(lerp(startX, endX, t));
        endY = Math.round(lerp(startY, endY, t));
      }

      // if (!mouseDownRef.current && startX === endX && startY === endY) clearInterval(moveKey.current);

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

      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";

      // setTimeout(toyMove, 1000 / 60, endX, endY, endX, endY, t);
    }
  };

  const toyGravityDrop = (vy?: number) => {
    if (!accelate.current || !toyRef.current) return;

    let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0) / 10);
    vy = vy !== undefined ? vy : Math.round(accelate.current.Y.reduce((sum, cur) => sum + cur, 0) / 10);

    toyDst.current.X = toyDst.current.X + vx;
    toyDst.current.Y = toyDst.current.Y + vy;

    vy += 5;

    if (vy < 30 || toyRef.current.offsetTop < 0) {
      setTimeout(toyGravityDrop, 1000 / 30, vy);
    } else {
      clearInterval(moveKey.current);
      toyDst.current.X = toyRef.current.offsetLeft;
      toyDst.current.Y = toyRef.current.offsetTop;
    }
  };

  const mouseDownEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (toyDst.current.X === -1) {
      toyDst.current.X = toyRef.current ? toyRef.current.offsetLeft : -1;
      toyDst.current.Y = toyRef.current ? toyRef.current.offsetTop : -1;
    }

    if (!mouseDownRef.current) {
      mouseDownRef.current = true;
      moveKey.current = setInterval(toyMove, 1000 / 60, 0.2);
    }
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;

      toyGravityDrop();
      if (accelate.current) {
        accelate.current.X = [];
        accelate.current.Y = [];
      }
    }
  };

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;

    const moveX = e.movementX;
    const moveY = e.movementY;

    toyDst.current.X = toyDst.current.X + e.movementX;
    toyDst.current.Y = toyDst.current.Y + e.movementY;

    if (accelate.current !== null) {
      accelate.current.X.push(moveX);
      accelate.current.Y.push(moveY);
      if (accelate.current.X.length > 5) {
        accelate.current.X.shift();
        accelate.current.Y.shift();
      }
    }

    // toyMove(startX, startY, endX, endY, 0.1);

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
      <Link href="/">HIHddII</Link>
      <Toy toyRef={toyRef} mouseDownEvent={mouseDownEvent} />
    </main>
  );
}
