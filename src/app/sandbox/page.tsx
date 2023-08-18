"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef } from "react";
import { Toy } from "./model/toy";
import Link from "next/link";
import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { lerp } from "@/utils/physicalEngine";

export default function Sandbox() {
  const screenRef: RefObject<HTMLElement> | null = useRef<HTMLElement>(null);
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);

  const moveKey = useRef<NodeJS.Timer>();
  const toyDst = useRef({ X: -1, Y: -1 });
  const accelate = useRef({
    X: [0],
    Y: [0],
  });

  const dummyToys: Array<Toy> = [
    { ref: createRef(), name: "qr-code", link: "", image: "" },
    { ref: createRef(), name: "dead-lock", link: "", image: "" },
    { ref: createRef(), name: "nwjns-powerpuffgirl", link: "", image: "" },
  ];

  const GVT_SPEED_OFFSET = 0.1;
  const SPIN_SPEED_OFFSET = 250;
  const FPS_OFFSET = 1000 / 60; // 60fps
  const UNDER_BOUND = 0.8;

  const toyMove = (t?: number) => {
    const toyRef = dummyToys[toyFocus.current].ref;
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
        if (!mouseDownRef.current) endX = startX;
        endY = Math.round(screenRef.current.offsetHeight * UNDER_BOUND);
      }

      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";
    }
  };

  const toyGravityDrop = (vy?: number) => {
    const toyRef = dummyToys[toyFocus.current].ref;
    if (!accelate.current || !toyRef.current || !screenRef.current) return;

    let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7));
    vy = vy !== undefined ? vy : Math.round(accelate.current.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);

    toyDst.current.X = toyDst.current.X + vx;
    toyDst.current.Y = toyDst.current.Y + vy;

    vy += 2;

    if (
      (vy < 30 || toyRef.current.offsetTop < 0) &&
      toyDst.current.Y < Math.round(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      setTimeout(toyGravityDrop, FPS_OFFSET, vy);
    } else {
      clearInterval(moveKey.current);
      toyDst.current.X = toyRef.current.offsetLeft;
      toyDst.current.Y = toyRef.current.offsetTop;
      toyRef.current.style.animationPlayState = "paused";
      if (accelate.current) {
        accelate.current.X = [];
        accelate.current.Y = [];
      }

      toyFocus.current = -1;
    }
  };

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDownRef.current || toyFocus.current !== -1) return;
    mouseDownRef.current = true;

    toyFocus.current = (e.target as HTMLDivElement).id.charAt(0) as unknown as number;
    const toyRef = dummyToys[toyFocus.current].ref;

    toyDst.current.X = toyRef.current ? e.clientX - toyRef.current.offsetWidth / 2 : -1;
    toyDst.current.Y = toyRef.current ? e.clientY - toyRef.current.offsetHeight / 2 : -1;
    moveKey.current = setInterval(toyMove, FPS_OFFSET, 0.2);
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;

    const toyRef = dummyToys[toyFocus.current].ref;

    if (accelate.current && toyRef.current) {
      let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0));

      toyRef.current.style.animationPlayState = "running";
      if (vx > 0) {
        toyRef.current.style.animationName = "spin-clockwise";
      } else if (vx < 0) {
        toyRef.current.style.animationName = "spin-counter-clockwise";
      }
      toyRef.current.style.animationDuration = `${Math.abs(SPIN_SPEED_OFFSET / vx)}s`;
    }

    toyGravityDrop();
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
      {dummyToys.map((v, i) => {
        return (
          <div className="toy-div" id={`${i}toy`} key={i} ref={dummyToys[i].ref} onMouseDown={mouseDownEvent}>
            .
          </div>
        );
      })}
    </main>
  );
}
