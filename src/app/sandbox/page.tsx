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

  const GVT_SPEED_OFFSET = 0.1;
  const SPIN_SPEED_OFFSET = 250;
  const FPS_OFFSET = 1000 / 60; // 60fps
  const UNDER_BOUND = 0.8;

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

      let hitWall = false;
      if (screenRef.current.offsetWidth - toyRef.current.offsetWidth < endX) {
        endX = screenRef.current.offsetWidth - toyRef.current.offsetWidth;
        hitWall = true;
      } else if (endX < 0) {
        endX = 0;
        hitWall = true;
      }
      if (hitWall) {
        toyDst.current.X = endX;
        accelate.current.X = accelate.current.X.map((v) => -v / 2);
        let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0));
        toyRef.current.style.animationDuration = `${Math.abs(SPIN_SPEED_OFFSET / vx)}s`;
      }

      if (screenRef.current.offsetHeight * UNDER_BOUND < endY) {
        if (!mouseDownRef.current) endX = toyRef.current.offsetLeft;
        endY = screenRef.current.offsetHeight * UNDER_BOUND;
      }

      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";
    }
  };

  const toyGravityDrop = (vy?: number) => {
    if (!accelate.current || !toyRef.current) return;

    let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 1.5));
    vy = vy !== undefined ? vy : Math.round(accelate.current.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);

    toyDst.current.X = toyDst.current.X + vx;
    toyDst.current.Y = toyDst.current.Y + vy;

    vy += 2;

    if (vy < 30 || toyRef.current.offsetTop < 0) {
      setTimeout(toyGravityDrop, FPS_OFFSET, vy);
    } else {
      clearInterval(moveKey.current);
      toyDst.current.X = toyRef.current.offsetLeft;
      toyDst.current.Y = toyRef.current.offsetTop;
      toyRef.current.style.animationPlayState = "paused";
      toyRef.current.className = "toy-div";
      if (accelate.current) {
        accelate.current.X = [];
        accelate.current.Y = [];
      }
    }
  };

  const mouseDownEvent: MouseEventHandler = (e: React.MouseEvent) => {
    toyDst.current.X = toyRef.current ? e.clientX - toyRef.current.offsetWidth / 2 : -1;
    toyDst.current.Y = toyRef.current ? e.clientY - toyRef.current.offsetHeight / 2 : -1;

    if (!mouseDownRef.current) {
      mouseDownRef.current = true;
      moveKey.current = setInterval(toyMove, FPS_OFFSET, 0.2);
    }
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;

      if (accelate.current && toyRef.current) {
        let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0));

        toyRef.current.className = "toy-div spin";
        toyRef.current.style.animationPlayState = "running";
        if (vx > 0) {
          toyRef.current.style.animationName = "spin-clockwise";
        } else if (vx < 0) {
          toyRef.current.style.animationName = "spin-counter-clockwise";
        }
        toyRef.current.style.animationDuration = `${Math.abs(SPIN_SPEED_OFFSET / vx)}s`;
      }

      toyGravityDrop();
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
