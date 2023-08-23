"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef, useState } from "react";
import { Toy } from "./model/toy";
import Link from "next/link";
import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { Circle, Coordinate, ToyPhysics, Vector, lerp, reactionByCircleCollision } from "@/utils/physicalEngine";

export default function Sandbox() {
  const [gridOn, setGridOn] = useState<boolean>(false);

  const screenRef: RefObject<HTMLElement> = useRef<HTMLElement>(null);
  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);

  const toyPhysicsList = useRef<Array<ToyPhysics>>([]);

  const dummyToys: Array<Toy> = [
    { ref: createRef(), name: "qr-code", link: "", image: "" },
    { ref: createRef(), name: "dead-lock", link: "", image: "" },
    { ref: createRef(), name: "nwjns-powerpuffgirl", link: "", image: "" },
  ];

  const GVT_SPEED_OFFSET = 0.1;
  const SPIN_SPEED_OFFSET = 0.2;
  const FPS_OFFSET = 1000 / 60; // 60fps
  const UNDER_BOUND = 0.8;
  const GRID_ROWS = 2;
  const GRID_COLS = 4;

  useEffect(() => {
    if (toyPhysicsList.current.length === 0) {
      dummyToys.forEach(() => {
        toyPhysicsList.current.push({
          X: [0],
          Y: [0],
          DST: { X: -1, Y: -1 } as Coordinate,
          V: { vx: 0, vy: 0 } as Vector,
          R: 0,
          dR: 0,
        });
      });
    }

    const id = setInterval(toyMove, FPS_OFFSET, 0.2);

    return () => {
      clearInterval(id);
    };
  });

  useEffect(() => {
    if (gridOn && screenRef.current) {
      const stdWidth = Math.round(screenRef.current.offsetWidth / (GRID_COLS + 1));
      const stdHeight = Math.round((screenRef.current.offsetHeight * UNDER_BOUND) / (GRID_ROWS + 1));
      const coors: Array<Coordinate> = [];

      for (let i = 1; i <= GRID_ROWS; i++) {
        for (let j = 1; j <= GRID_COLS; j++) {
          coors.push({ X: stdWidth * j, Y: stdHeight * i });
        }
      }

      coors.forEach((v, i) => {
        if (toyPhysicsList.current.length > i) {
          const toyPhysics = toyPhysicsList.current[i];

          toyPhysics.DST = v;
          toyPhysics.R = 0;
          toyPhysics.X = [];
          toyPhysics.Y = [];
          toyPhysics.V.vx = 0;
          toyPhysics.V.vy = 0;
          toyPhysics.dR = 0;

          console.log(toyPhysicsList.current[i]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridOn]);

  const toyMove = (t?: number) => {
    const data: Array<Circle | null> = dummyToys.map((v) => {
      if (v.ref.current) {
        return { x: v.ref.current.offsetLeft, y: v.ref.current.offsetTop, d: v.ref.current.offsetWidth };
      } else {
        return null;
      }
    });

    dummyToys.forEach((v, i) => {
      const toyRef = v.ref;
      if (toyRef.current === null || screenRef.current === null || toyPhysicsList.current === null) return;

      const toyPhysics = toyPhysicsList.current[i];

      let startX = toyRef.current.offsetLeft;
      let startY = toyRef.current.offsetTop;
      let endX = toyPhysics.DST.X;
      let endY = toyPhysics.DST.Y;

      if (t !== undefined) {
        let newX = lerp(startX, endX, t);
        let newY = lerp(startY, endY, t);
        endX = Math.abs(endX - newX) < 1 ? endX : newX;
        endY = Math.abs(endY - newY) < 1 ? endY : newY;
      }

      if (startX === endX && startY === endY) return;

      let rotate = toyPhysics.R + toyPhysics.dR;
      toyPhysics.R = rotate;

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
        toyPhysics.DST.X = endX;
        toyPhysics.V.vx = -toyPhysics.V.vx / 2;
        toyPhysics.dR = toyPhysics.dR / 2;
      }

      // 객체 충돌 감지
      if (i !== toyFocus.current && !gridOn && !(toyPhysics.V.vx === 0 && toyPhysics.V.vy === 0)) {
        const vector = reactionByCircleCollision(data, i, toyPhysics.V);
        if (vector !== null) {
          console.log("collision: " + i);
          toyPhysics.V = vector;
          endX = startX + vector.vx;
          endY = startY + vector.vy;
          toyPhysics.DST.X = endX;
          toyPhysics.DST.Y = endY;
          toyPhysics.dR = vector.vx * SPIN_SPEED_OFFSET;
        }
      }

      // 바닥 하한선 감지
      if (screenRef.current.offsetHeight * UNDER_BOUND < endY) {
        if (!mouseDownRef.current) endX = startX;
        endY = Math.round(screenRef.current.offsetHeight * UNDER_BOUND);
      }

      toyRef.current.style.left = endX + "px";
      toyRef.current.style.top = endY + "px";
      toyRef.current.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
    });
  };

  const toyGravityDrop = (index: number) => {
    const toyRef = dummyToys[index].ref;
    if (toyPhysicsList.current === null || toyRef.current === null || screenRef.current === null) return;

    const toyPhysics = toyPhysicsList.current[index];

    let vx = toyPhysics.V.vx;
    let vy = toyPhysics.V.vy;

    toyPhysics.DST.X += vx;
    toyPhysics.DST.Y += vy;

    toyPhysics.V.vy += 2;

    if (
      (vy < 30 || toyRef.current.offsetTop < toyRef.current.offsetHeight) &&
      toyPhysics.DST.Y < Math.round(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      setTimeout(toyGravityDrop, FPS_OFFSET, index);
    } else {
      toyPhysics.DST.X = toyRef.current.offsetLeft;
      toyPhysics.DST.Y = toyRef.current.offsetTop;

      toyPhysics.X = [];
      toyPhysics.Y = [];
      toyPhysics.V.vx = 0;
      toyPhysics.V.vy = 0;
      toyPhysics.dR = 0;
    }
  };

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDownRef.current || gridOn) return;
    mouseDownRef.current = true;

    let focus = Number((e.target as HTMLDivElement).id.charAt(0));
    toyFocus.current = focus;
    const toyRef = dummyToys[focus].ref;
    const toyPhysics = toyPhysicsList.current[focus];

    if (toyRef.current) {
      toyPhysics.DST.X = e.clientX;
      toyPhysics.DST.Y = e.clientY;

      toyPhysics.R = Number(toyRef.current.style.transform.substring(29).split("d")[0]);
    }
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;

    const focus = toyFocus.current;
    const toyRef = dummyToys[focus].ref;
    const toyPhysics = toyPhysicsList.current[focus];

    if (toyPhysics && toyRef.current) {
      let vx = Math.round(toyPhysics.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7));
      let vy = Math.round(toyPhysics.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);
      toyPhysics.V.vx = vx;
      toyPhysics.V.vy = vy;

      toyPhysics.dR = vx * SPIN_SPEED_OFFSET;
    }

    toyGravityDrop(focus);

    toyFocus.current = -1;
  };

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;

    const moveX = e.movementX;
    const moveY = e.movementY;
    const toyPhysics = toyPhysicsList.current[toyFocus.current];

    toyPhysics.DST.X += e.movementX;
    toyPhysics.DST.Y += e.movementY;

    toyPhysics.X.push(moveX);
    toyPhysics.Y.push(moveY);
    if (toyPhysics.X.length > 5) {
      toyPhysics.X.shift();
      toyPhysics.Y.shift();
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
      <div
        className={`sandbox-toggle-button ${gridOn ? "toggle-checked" : ""}`}
        onClick={() => setGridOn((s) => !s)}
      ></div>
      <div className="physics-checker" onClick={() => console.log(toyPhysicsList.current)}></div>
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
