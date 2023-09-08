"use client";

import { MouseEventHandler, MutableRefObject, RefObject, createRef, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Toy, ToyPhysics, defaultToyPhysics } from "./model/toy";
import Background from "/public/assets/images/sandbox-background.svg";
import IconShrink from "/public/assets/icons/Icon-Shrink.svg";
import IconGrid from "/public/assets/icons/Icon-Grid.svg";
import IconShake from "/public/assets/icons/Icon-Shake.svg";
import IconLog from "/public/assets/icons/Icon-Log.svg";
import IconTutorial from "/public/assets/icons/Icon-Tutorial.svg";

import ToyTutoMouse from "/public/assets/icons/toy-tuto-mouse.svg";
import ToyLinkQR from "/public/assets/icons/toy-link-qr.png";
import ToyDeadlock from "/public/assets/icons/toy-deadlock.svg";
import ToyNWJNS from "/public/assets/images/nwjns/haerin-fow-1.png";

import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { Circle, Coordinate, Vector, lerp, randomCoordinate, reactionByCircleCollision } from "@/utils/physicalEngine";
import { SandboxTutorial } from "./demonstrations";
import {
  GVT_SPEED_OFFSET,
  SPIN_SPEED_OFFSET,
  FPS_OFFSET,
  UNDER_BOUND,
  GRID_ROWS,
  GRID_COLS,
  TUTORIAL_INDEX,
} from "./model/constants";

enum AlignType {
  Grid = 0,
  Free = 1,
  Shake = 2,
}

export default function Sandbox() {
  console.log("rerender!");

  const [backgroundShrink, setBackgroundShrink] = useState(true);
  const [backgroundSize, setBackgroundSize] = useState({ width: 1920, height: 1080 });
  const [initialized, setInitialized] = useState<boolean>(false);

  const screenRef: RefObject<HTMLElement> = useRef<HTMLElement>(null);
  const backgroundRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgShadowRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const dockerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const tutorialMessageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const mouseDownRef: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);
  const backgroundOffset = useRef({ left: 0, top: 0 });
  const alignRef = useRef(AlignType.Free);

  const toyList = useRef<Array<Toy>>([
    {
      name: "qr-code",
      moveRef: createRef(),
      rotateRef: createRef(),
      physics: { ...defaultToyPhysics },
      link: "",
      image: ToyLinkQR,
    },
    {
      name: "dead-lock",
      moveRef: createRef(),
      rotateRef: createRef(),
      physics: { ...defaultToyPhysics },
      link: "",
      image: ToyDeadlock,
    },
    {
      name: "nwjns-powerpuffgirl",
      moveRef: createRef(),
      rotateRef: createRef(),
      physics: { ...defaultToyPhysics },
      link: "",
      image: ToyNWJNS,
    },
    {
      name: "tutorial",
      moveRef: createRef(),
      rotateRef: createRef(),
      physics: { ...defaultToyPhysics },
      link: "",
      image: ToyTutoMouse,
    },
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    toyList.current.forEach((v) => {
      if (screenRef.current && v.physics.DST.X === -1 && v.physics.DST.Y === -1) {
        v.physics.DST = randomCoordinate(screenRef.current.offsetWidth, screenRef.current.offsetHeight * UNDER_BOUND);
      }
    });

    toyList.current[TUTORIAL_INDEX].physics.FIXED = true;
    if (toyList.current[TUTORIAL_INDEX].moveRef.current)
      toyList.current[TUTORIAL_INDEX].moveRef.current.style.visibility = "hidden";

    if (!initialized) setInitialized(true);

    const toyMoveId = setInterval(toyMove, FPS_OFFSET, 0.2);
    let bgMoveId: string | number | NodeJS.Timer | undefined;

    if (backgroundRef.current !== null) {
      if (!backgroundShrink) {
        bgMoveId = setInterval(backgroundMove, FPS_OFFSET);
        // console.log("false");
      } else {
        backgroundRef.current.style.left = "0px";
        backgroundRef.current.style.top = "0px";
        // console.log("true");
      }
    }

    backgroundInitialize();
    window.addEventListener("resize", backgroundInitialize);

    return () => {
      window.removeEventListener("resize", backgroundInitialize);
      clearInterval(toyMoveId);
      if (bgMoveId !== undefined) {
        clearInterval(bgMoveId);
      }
    };
  });

  const backgroundInitialize = () => {
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

    if (!backgroundShrink) {
      bgWidth += 160;
      bgHeight += 90;
    }

    if (backgroundSize.width !== bgWidth || backgroundSize.height !== bgHeight) {
      if (backgroundShrink) {
        let offsetLeft = -(bgWidth - screenWidth) / 2;
        let offsetTop = -(bgHeight - screenHeight) / 2;

        backgroundOffset.current = { left: offsetLeft, top: offsetTop };
        backgroundRef.current.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

        setBackgroundSize({ width: bgWidth, height: bgHeight });
      } else {
        setBackgroundSize({ width: bgWidth, height: bgHeight });

        let offsetLeft = -(bgWidth - screenWidth) / 2;
        let offsetTop = -(bgHeight - screenHeight) / 2;

        backgroundOffset.current = { left: offsetLeft, top: offsetTop };
        backgroundRef.current.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
      }
    }
  };

  const alignModeChange = (mode: AlignType) => {
    if (screenRef.current === null || bgShadowRef.current === null) return;

    if (mode === AlignType.Grid) {
      alignRef.current = AlignType.Grid;

      const stdWidth = Math.round(screenRef.current.offsetWidth / (GRID_COLS + 1));
      const stdHeight = Math.round((screenRef.current.offsetHeight * UNDER_BOUND) / (GRID_ROWS + 1));
      const coors: Array<Coordinate> = [];

      for (let i = 1; i <= GRID_ROWS; i++) {
        for (let j = 1; j <= GRID_COLS; j++) {
          coors.push({ X: stdWidth * j, Y: stdHeight * i });
        }
      }
      coors.forEach((v, i) => {
        if (toyList.current.length > i) {
          const toyPhysics = toyList.current[i].physics;

          toyPhysics.DST = v;
          toyPhysics.R = 0;
          toyPhysics.X = [];
          toyPhysics.Y = [];
          toyPhysics.V.vx = 0;
          toyPhysics.V.vy = 0;
          toyPhysics.dR = 0;
        }
      });

      bgShadowRef.current.className = "sandbox-shadow";
    } else if (mode === AlignType.Free) {
      alignRef.current = AlignType.Free;

      toyList.current.forEach((v, i) => {
        v.physics.V.vx = Math.round(Math.random() * 6) - 3;
        v.physics.V.vy = Math.round(Math.random() * 6) - 3;

        toyGravityDrop(i);
      });

      bgShadowRef.current.className = "";
    } else if (mode === AlignType.Shake) {
      alignRef.current = AlignType.Shake;

      shake();
      bgShadowRef.current.className = "";
    }
  };

  const backgroundMove = () => {
    if (screenRef.current === null || backgroundRef.current === null) return;

    const stdWidth = screenRef.current.offsetWidth / 2;
    const stdHeight = screenRef.current.offsetHeight / 2;
    const offsetLeft = backgroundOffset.current.left;
    const offsetTop = backgroundOffset.current.top;
    let meanX = 0;
    let meanY = 0;

    toyList.current.forEach((v) => {
      const toyRef = v.moveRef;
      if (toyRef.current === null) return;

      meanX += toyRef.current.offsetLeft;
      meanY += toyRef.current.offsetTop;
    });

    meanX /= toyList.current.length;
    meanY /= toyList.current.length;

    const moveX = Math.round(((meanX - stdWidth) * 90) / stdWidth);
    const moveY = Math.round(((meanY - stdHeight) * 45) / stdHeight);

    backgroundRef.current.style.left = -moveX + "px";
    backgroundRef.current.style.top = -moveY + "px";
  };

  const toyMove = (t?: number) => {
    const data: Array<Circle | null> = toyList.current.map((v, i) => {
      if (v.moveRef.current && i !== TUTORIAL_INDEX) {
        return { x: v.moveRef.current.offsetLeft, y: v.moveRef.current.offsetTop, d: v.moveRef.current.offsetWidth };
      } else {
        return null;
      }
    });

    toyList.current.forEach((v, i) => {
      if (v.physics.FIXED) return;

      const toyMoveRef = v.moveRef;
      const toyRotateRef = v.rotateRef;
      if (toyMoveRef.current === null || screenRef.current === null || toyRotateRef.current === null) return;

      const toyPhysics = toyList.current[i].physics;

      let startX = toyMoveRef.current.offsetLeft;
      let startY = toyMoveRef.current.offsetTop;
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
      if (screenRef.current.offsetWidth - toyMoveRef.current.offsetWidth / 2 < endX) {
        endX = screenRef.current.offsetWidth - toyMoveRef.current.offsetWidth / 2;
        hitWall = true;
      } else if (endX < toyMoveRef.current.offsetWidth / 2) {
        endX = toyMoveRef.current.offsetWidth / 2;
        hitWall = true;
      }
      if (hitWall) {
        toyPhysics.DST.X = endX;
        toyPhysics.V.vx = -toyPhysics.V.vx / 2;
        toyPhysics.dR = toyPhysics.dR / 2;
      }

      // 객체 충돌 감지
      if (
        i !== toyFocus.current &&
        alignRef.current !== AlignType.Grid &&
        !(toyPhysics.V.vx === 0 && toyPhysics.V.vy === 0)
      ) {
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

      toyMoveRef.current.style.left = endX + "px";
      toyMoveRef.current.style.top = endY + "px";
      toyMoveRef.current.style.transform = `translate(-50%, -50%) `;
      toyRotateRef.current.style.transform = `rotate(${rotate}deg)`;
    });
  };

  const toyGravityDrop = (index: number) => {
    const toyRef = toyList.current[index].moveRef;
    if (toyRef.current === null || screenRef.current === null) return;

    const toyPhysics = toyList.current[index].physics;

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

  const spread = (index: number, outer: boolean) => {
    if (screenRef.current === null) return;

    const toyPhysics = toyList.current[index].physics;
    if (outer) {
      toyPhysics.DST = randomCoordinate(screenRef.current.offsetWidth, -200);
    } else {
      toyPhysics.DST = randomCoordinate(screenRef.current.offsetWidth, screenRef.current.offsetHeight * UNDER_BOUND);
    }
  };

  const shake = () => {
    toyList.current.forEach((v, i) => {
      v.physics.V.vx = Math.round(Math.random() * 30) - 15;
      v.physics.V.vy = Math.round(Math.random() * -30);

      toyGravityDrop(i);
    });
  };

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDownRef.current || alignRef.current === AlignType.Grid) return;
    mouseDownRef.current = true;

    let focus = Number((e.target as HTMLDivElement).id.charAt(0));
    toyFocus.current = focus;
    const toyMoveRef = toyList.current[focus].moveRef;
    const toyRotateRef = toyList.current[focus].rotateRef;
    const toyPhysics = toyList.current[focus].physics;

    if (toyMoveRef.current && toyRotateRef.current) {
      toyPhysics.DST.X = e.clientX;
      toyPhysics.DST.Y = e.clientY;

      toyPhysics.R = Number(toyRotateRef.current.style.transform.substring(7).split("d")[0]);
    }
  };

  const mouseUpEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;

    const focus = toyFocus.current;
    const toyRef = toyList.current[focus].moveRef;
    const toyPhysics = toyList.current[focus].physics;

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
    const toyPhysics = toyList.current[toyFocus.current].physics;

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
        <div className="" ref={bgShadowRef}></div>
        <Background width={backgroundSize.width} height={backgroundSize.height} />
      </div>
      <main
        className="sandbox-screen"
        onMouseLeave={mouseUpEvent}
        onMouseUp={mouseUpEvent}
        onMouseMove={mouseMoveEvent}
        ref={screenRef}
      >
        {toyList.current.map((v, i) => {
          return (
            <div className="toy-div" id={`${i}toy`} ref={v.moveRef} onMouseDown={mouseDownEvent} key={i}>
              <div id={`${i}toy`} ref={v.rotateRef}>
                {typeof v.image === "function" ? (
                  <v.image className="toy-image" />
                ) : typeof v.image === "object" ? (
                  <Image className="toy-image" src={v.image} alt={""} />
                ) : (
                  <div className="toy-image">A</div>
                )}
              </div>
              {i === TUTORIAL_INDEX ? (
                <div className="toy-tutorial-message" ref={tutorialMessageRef}>
                  AAAA
                </div>
              ) : (
                <></>
              )}
            </div>
          );
        })}
        <Link href="/" className={alignRef.current === AlignType.Grid ? "sandbox-title on-grid" : "sandbox-title"}>
          over-engineering
        </Link>
        <div className="master-docker">
          {/* <IconTutorial
            className="sidemenu-button"
            onClick={() => {
              if (screenRef.current === null) return;
              const coor =
                screenRef.current.offsetHeight < screenRef.current.offsetWidth
                  ? {
                      X: screenRef.current.offsetWidth - screenRef.current.offsetHeight * 0.15,
                      Y: screenRef.current.offsetHeight * 0.5,
                    }
                  : { X: screenRef.current.offsetWidth * 0.85, Y: screenRef.current.offsetHeight * 0.5 };
              SandboxTutorial(
                dummyToys,
                toyPhysicsList,
                bgShadowRef,
                tutorialMessageRef,
                dockerRef,
                toyGravityDrop,
                spread,
                coor
              );
            }}
            color={align === AlignType.Grid ? "white" : "gray"}
          /> */}
          <IconLog
            className="sidemenu-button"
            onClick={logBtn}
            color={alignRef.current === AlignType.Grid ? "white" : "gray"}
          />
        </div>
        <div className="sandbox-docker" ref={dockerRef}>
          <IconShrink
            className="sidemenu-button"
            onClick={() => {
              setBackgroundShrink((state) => !state);
            }}
            color={backgroundShrink === true ? "aquamarine" : alignRef.current === AlignType.Grid ? "white" : "gray"}
          />
          <IconGrid
            className="sidemenu-button"
            onClick={() => alignModeChange(alignRef.current === AlignType.Grid ? AlignType.Free : AlignType.Grid)}
            color={alignRef.current === AlignType.Grid ? "aquamarine" : "gray"}
          />
          <IconShake
            className="sidemenu-button"
            onClick={() => alignModeChange(AlignType.Shake)}
            color={alignRef.current === AlignType.Grid ? "white" : "gray"}
          />
        </div>
      </main>
    </>
  );
}
