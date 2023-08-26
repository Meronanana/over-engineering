"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Toy } from "./model/toy";
import Background from "../../../public/assets/images/sandbox-background.svg";
import IconGrid from "../../../public/assets/icons/Icon-Grid.svg";
import IconShake from "../../../public/assets/icons/Icon-Shake.svg";
import IconLog from "../../../public/assets/icons/Icon-Log.svg";
import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import {
  Circle,
  Coordinate,
  ToyPhysics,
  Vector,
  lerp,
  randomCoordinate,
  reactionByCircleCollision,
} from "@/utils/physicalEngine";

enum AlignType {
  Grid = 0,
  Free = 1,
  Shake = 2,
}

export default function Sandbox() {
  const [align, setAlign] = useState<AlignType>(1);
  const [backgroundSize, setBackgroundSize] = useState({ width: 1920, height: 1080 });
  const [initialized, setInitialized] = useState<boolean>(false);

  const screenRef: RefObject<HTMLElement> = useRef<HTMLElement>(null);
  const backgroundRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);
  const toyPhysicsList = useRef<Array<ToyPhysics>>([]);
  const backgroundOffset = useRef({ left: 0, top: 0 });

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

  const BACKGROUND_SIZE = { width: 3840, height: 2160 };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (toyPhysicsList.current.length === 0) {
      dummyToys.forEach(() => {
        if (screenRef.current) {
          toyPhysicsList.current.push({
            X: [0],
            Y: [0],
            DST: randomCoordinate(screenRef.current.offsetWidth, screenRef.current.offsetHeight * UNDER_BOUND),
            V: { vx: 0, vy: 0 } as Vector,
            R: 0,
            dR: 0,
          });
        } else {
          toyPhysicsList.current.push({
            X: [0],
            Y: [0],
            DST: { X: -1, Y: -1 } as Coordinate,
            V: { vx: 0, vy: 0 } as Vector,
            R: 0,
            dR: 0,
          });
        }
      });
    }

    backgroundInitialize();
    window.addEventListener("resize", backgroundInitialize);

    if (!initialized) setInitialized(true);

    const toyMoveId = setInterval(toyMove, FPS_OFFSET, 0.2);
    const bgMoveId = setInterval(bgMove, FPS_OFFSET);

    return () => {
      window.removeEventListener("resize", backgroundInitialize);
      clearInterval(toyMoveId);
      clearInterval(bgMoveId);
    };
  });

  useEffect(() => {
    if (!initialized) return;

    if (align === AlignType.Grid && screenRef.current) {
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
        }
      });
    } else if (align === AlignType.Free && screenRef.current) {
      toyPhysicsList.current.forEach((v, i) => {
        v.V.vx = Math.round(Math.random() * 6) - 3;
        v.V.vy = Math.round(Math.random() * 6) - 3;

        toyGravityDrop(i);
      });
    } else if (align === AlignType.Shake && screenRef.current) {
      shake();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [align]);

  const backgroundInitialize = () => {
    console.log("HIHI");
    if (screenRef.current === null || backgroundRef.current === null) return;

    const screenWidth = screenRef.current.offsetWidth;
    const screenHeight = screenRef.current.offsetHeight;

    let bgWidth, bgHeight;

    if ((screenHeight * 16) / 9 < screenWidth) {
      bgWidth = screenWidth;
      bgHeight = (bgWidth * 9) / 16;
    } else {
      bgHeight = screenHeight;
      bgWidth = (bgHeight * 16) / 9;
    }
    bgWidth += 160;
    bgHeight += 90;

    if (backgroundSize.width !== bgWidth || backgroundSize.height !== bgHeight) {
      setBackgroundSize({ width: bgWidth, height: bgHeight });
      backgroundOffset.current = { left: -(bgWidth - screenWidth) / 2, top: -(bgHeight - screenHeight) / 2 };
      backgroundRef.current.style.transform = `translate(${backgroundOffset.current.left}px, ${backgroundOffset.current.top}px)`;
    }
  };

  const bgMove = () => {
    if (screenRef.current === null || backgroundRef.current === null) return;

    const stdWidth = screenRef.current.offsetWidth / 2;
    const stdHeight = screenRef.current.offsetHeight / 2;
    const offsetLeft = backgroundOffset.current.left;
    const offsetTop = backgroundOffset.current.top;
    let meanX = 0;
    let meanY = 0;

    dummyToys.forEach((v) => {
      const toyRef = v.ref;
      if (toyRef.current === null) return;

      meanX += toyRef.current.offsetLeft;
      meanY += toyRef.current.offsetTop;
    });

    meanX /= dummyToys.length;
    meanY /= dummyToys.length;

    const moveX = Math.round(((meanX - stdWidth) * 90) / stdWidth);
    const moveY = Math.round(((meanY - stdHeight) * 45) / stdHeight);

    backgroundRef.current.style.left = -moveX + "px";
    backgroundRef.current.style.top = -moveY + "px";
  };

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
      if (i !== toyFocus.current && align !== AlignType.Grid && !(toyPhysics.V.vx === 0 && toyPhysics.V.vy === 0)) {
        const vector = reactionByCircleCollision(data, i, toyPhysics.V);
        if (vector !== null) {
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

  const shake = () => {
    if (toyPhysicsList.current === null) return;

    toyPhysicsList.current.forEach((v, i) => {
      v.V.vx = Math.round(Math.random() * 30) - 15;
      v.V.vy = Math.round(Math.random() * -30);

      toyGravityDrop(i);
    });
  };

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDownRef.current || align === AlignType.Grid) return;
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

  const logBtn = () => {
    // console.log(toyPhysicsList.current);
    // console.log(backgroundRef.current?.offsetWidth, backgroundRef.current?.offsetHeight);
    console.log(backgroundRef.current?.style.transform);
    // console.log(screenRef.current?.offsetWidth, screenRef.current?.offsetHeight);
    console.log(backgroundSize);
  };

  return (
    <>
      <div className="sandbox-background" ref={backgroundRef}>
        <Background width={backgroundSize.width} height={backgroundSize.height} />
      </div>
      <main
        className="sandbox-screen"
        onMouseLeave={mouseUpEvent}
        onMouseUp={mouseUpEvent}
        onMouseMove={mouseMoveEvent}
        ref={screenRef}
      >
        {dummyToys.map((v, i) => {
          return (
            <div className="toy-div" id={`${i}toy`} key={i} ref={dummyToys[i].ref} onMouseDown={mouseDownEvent}>
              A
            </div>
          );
        })}
        <Link href="/" className="sandbox-title">
          over-engineering
        </Link>
        <div className="sandbox-sidemenu">
          <div
            className="sidemenu-button"
            onClick={() => setAlign(align === AlignType.Grid ? AlignType.Free : AlignType.Grid)}
          >
            <IconGrid color={align === AlignType.Grid ? "aquamarine" : "gray"} />
          </div>
          <div
            className="sidemenu-button"
            onClick={() => (align === AlignType.Shake ? shake() : setAlign(AlignType.Shake))}
          >
            <IconShake />
          </div>
          <div className="sidemenu-button" onClick={logBtn}>
            <IconLog />
          </div>
        </div>
      </main>
    </>
  );
}
