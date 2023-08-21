"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef } from "react";
import { Toy } from "./model/toy";
import Link from "next/link";
import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { Circle, Vector, lerp, reactionCircleCollision } from "@/utils/physicalEngine";

// TODO: 회전 애니메이션 손보기
export default function Sandbox() {
  const screenRef: RefObject<HTMLElement> | null = useRef<HTMLElement>(null);
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);

  const moveKey = useRef<NodeJS.Timer>();
  const toyDst = useRef({ X: -1, Y: -1 });
  const accelate = useRef({
    X: [0],
    Y: [0],
    V: { vx: 0, vy: 0 } as Vector,
  });

  const dummyToys: Array<Toy> = [
    { ref: createRef(), name: "qr-code", link: "", image: "" },
    { ref: createRef(), name: "dead-lock", link: "", image: "" },
    { ref: createRef(), name: "nwjns-powerpuffgirl", link: "", image: "" },
  ];

  const GVT_SPEED_OFFSET = 0.1;
  const SPIN_SPEED_OFFSET = 40;
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

      // 벽 충돌 감지
      let hitWall = false;
      if (screenRef.current.offsetWidth - toyRef.current.offsetWidth / 2 < endX) {
        endX = screenRef.current.offsetWidth - toyRef.current.offsetWidth / 2;
        hitWall = true;
      } else if (endX < toyRef.current.offsetWidth / 2) {
        endX = toyRef.current.offsetWidth / 2;
        hitWall = true;
      }
      if (hitWall) {
        toyDst.current.X = endX;
        accelate.current.X = accelate.current.X.map((v) => -v / 2);
        accelate.current.V.vx = Math.round(
          accelate.current.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7)
        );
        toyRef.current.style.animationDuration = `${Math.abs(SPIN_SPEED_OFFSET / accelate.current.V.vx)}s`;
      }

      // 객체 충돌 감지
      if (!mouseDownRef.current) {
        const data: Array<Circle | undefined> = dummyToys.map((v) => {
          if (v.ref.current) {
            return { x: v.ref.current.offsetLeft, y: v.ref.current.offsetTop, d: v.ref.current.offsetWidth };
          } else {
            return undefined;
          }
        });

        const vector = reactionCircleCollision(data, toyFocus.current);
      }

      if (screenRef.current.offsetHeight * UNDER_BOUND < endY) {
        if (!mouseDownRef.current) endX = startX;
        endY = Math.round(screenRef.current.offsetHeight * UNDER_BOUND);
      }

      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";
    }
  };

  const toyGravityDrop = () => {
    const toyRef = dummyToys[toyFocus.current].ref;
    if (!accelate.current || !toyRef.current || !screenRef.current) return;

    let vx = accelate.current.V.vx;
    let vy = accelate.current.V.vy;

    toyDst.current.X += vx;
    toyDst.current.Y += vy;

    accelate.current.V.vy += 2;

    if (
      (vy < 30 || toyRef.current.offsetTop < toyRef.current.offsetHeight) &&
      toyDst.current.Y < Math.round(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      setTimeout(toyGravityDrop, FPS_OFFSET);
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

    toyDst.current.X = toyRef.current ? e.clientX : -1;
    toyDst.current.Y = toyRef.current ? e.clientY : -1;
    moveKey.current = setInterval(toyMove, FPS_OFFSET, 0.2);
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;

    const toyRef = dummyToys[toyFocus.current].ref;

    if (accelate.current && toyRef.current) {
      let vx = Math.round(accelate.current.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7));
      let vy = Math.round(accelate.current.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);
      accelate.current.V.vx = vx;
      accelate.current.V.vy = vy;

      if (vx > 0) {
        toyRef.current.style.animationName = "spin-clockwise";
      } else if (vx < 0) {
        toyRef.current.style.animationName = "spin-counter-clockwise";
      }
      toyRef.current.style.animationPlayState = "running";
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
            A
          </div>
        );
      })}
    </main>
  );
}
