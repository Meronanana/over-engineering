"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef } from "react";
import { Toy } from "./model/toy";
import Link from "next/link";
import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { Circle, Coordinate, Vector, lerp, reactionCircleCollision } from "@/utils/physicalEngine";

// TODO: 회전 애니메이션 손보기
export default function Sandbox() {
  const screenRef: RefObject<HTMLElement> | null = useRef<HTMLElement>(null);
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);

  const moveKey = useRef<NodeJS.Timer>();
  const toyPhysics = useRef({
    X: [0],
    Y: [0],
    DST: { X: -1, Y: -1 } as Coordinate,
    V: { vx: 0, vy: 0 } as Vector,
    R: 0,
    dR: 0,
  });

  const dummyToys: Array<Toy> = [
    { ref: createRef(), name: "qr-code", link: "", image: "" },
    { ref: createRef(), name: "dead-lock", link: "", image: "" },
    { ref: createRef(), name: "nwjns-powerpuffgirl", link: "", image: "" },
  ];

  const GVT_SPEED_OFFSET = 0.1;
  const SPIN_SPEED_OFFSET = 0.2;
  const FPS_OFFSET = 1000 / 60; // 60fps
  const UNDER_BOUND = 0.8;

  const toyMove = (t?: number) => {
    const toyRef = dummyToys[toyFocus.current].ref;
    if (toyRef.current === null || screenRef.current === null || toyPhysics.current === null) return;

    let startX = toyRef.current.offsetLeft;
    let startY = toyRef.current.offsetTop;
    let endX = toyPhysics.current.DST.X;
    let endY = toyPhysics.current.DST.Y;
    let rotate = toyPhysics.current.R + toyPhysics.current.dR;
    toyPhysics.current.R = rotate;

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
      toyPhysics.current.DST.X = endX;
      toyPhysics.current.V.vx = -toyPhysics.current.V.vx / 2;
      toyPhysics.current.dR = toyPhysics.current.dR / 2;
    }

    // 객체 충돌 감지
    if (!mouseDownRef.current) {
      const data: Array<Circle | null> = dummyToys.map((v) => {
        if (v.ref.current) {
          return { x: v.ref.current.offsetLeft, y: v.ref.current.offsetTop, d: v.ref.current.offsetWidth };
        } else {
          return null;
        }
      });

      const vector = reactionCircleCollision(data, toyFocus.current, toyPhysics.current.V);
      if (vector !== null) {
        toyPhysics.current.V = vector;
        endX = startX + vector.vx;
        endY = startY + vector.vy;
        toyPhysics.current.DST.X = endX;
        toyPhysics.current.DST.Y = endY;
        toyPhysics.current.dR = vector.vx * SPIN_SPEED_OFFSET;
      }
    }

    if (screenRef.current.offsetHeight * UNDER_BOUND < endY) {
      if (!mouseDownRef.current) endX = startX;
      endY = Math.round(screenRef.current.offsetHeight * UNDER_BOUND);
    }

    toyRef.current.style.left = endX + "px";
    toyRef.current.style.top = endY + "px";
    toyRef.current.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
  };

  const toyGravityDrop = () => {
    const toyRef = dummyToys[toyFocus.current].ref;
    if (!toyPhysics.current || !toyRef.current || !screenRef.current) return;

    let vx = toyPhysics.current.V.vx;
    let vy = toyPhysics.current.V.vy;

    toyPhysics.current.DST.X += vx;
    toyPhysics.current.DST.Y += vy;

    toyPhysics.current.V.vy += 2;

    if (
      (vy < 30 || toyRef.current.offsetTop < toyRef.current.offsetHeight) &&
      toyPhysics.current.DST.Y < Math.round(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      setTimeout(toyGravityDrop, FPS_OFFSET);
    } else {
      clearInterval(moveKey.current);
      toyPhysics.current.DST.X = toyRef.current.offsetLeft;
      toyPhysics.current.DST.Y = toyRef.current.offsetTop;

      toyPhysics.current.X = [];
      toyPhysics.current.Y = [];
      toyPhysics.current.V.vx = 0;
      toyPhysics.current.V.vy = 0;
      toyPhysics.current.dR = 0;

      toyFocus.current = -1;
    }
  };

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDownRef.current || toyFocus.current !== -1) return;
    mouseDownRef.current = true;

    toyFocus.current = Number((e.target as HTMLDivElement).id.charAt(0));
    const toyRef = dummyToys[toyFocus.current].ref;

    if (toyRef.current) {
      toyPhysics.current.DST.X = e.clientX;
      toyPhysics.current.DST.Y = e.clientY;

      toyPhysics.current.R = Number(toyRef.current.style.transform.substring(29).split("d")[0]);
    }

    moveKey.current = setInterval(toyMove, FPS_OFFSET, 0.2);
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;

    const toyRef = dummyToys[toyFocus.current].ref;

    if (toyPhysics.current && toyRef.current) {
      let vx = Math.round(toyPhysics.current.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7));
      let vy = Math.round(toyPhysics.current.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);
      toyPhysics.current.V.vx = vx;
      toyPhysics.current.V.vy = vy;

      toyPhysics.current.dR = vx * SPIN_SPEED_OFFSET;
    }

    toyGravityDrop();
  };

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;

    const moveX = e.movementX;
    const moveY = e.movementY;

    toyPhysics.current.DST.X = toyPhysics.current.DST.X + e.movementX;
    toyPhysics.current.DST.Y = toyPhysics.current.DST.Y + e.movementY;

    if (toyPhysics.current !== null) {
      toyPhysics.current.X.push(moveX);
      toyPhysics.current.Y.push(moveY);
      if (toyPhysics.current.X.length > 5) {
        toyPhysics.current.X.shift();
        toyPhysics.current.Y.shift();
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
