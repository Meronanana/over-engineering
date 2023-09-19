"use client";

import {
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  TouchEventHandler,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import { SandboxAlignType, Toy, defaultToyPhysics } from "./model/types";
import Background from "/public/assets/images/sandbox-background.svg";

import ToyTutoMouse from "/public/assets/icons/toy-tuto-mouse.svg";
import ToyLinkQR from "/public/assets/icons/toy-link-qr.png";
import ToyDeadlock from "/public/assets/icons/toy-deadlock.svg";

import ToyComponent from "./components/ToyComponent";

import "./sandbox.scss";
import { Circle, Coordinate, Vector, lerp, randomCoordinate, reactionByCircleCollision } from "@/utils/physicalEngine";
import { SandboxTutorial } from "./demonstrations";
import {
  GVT_SPEED_OFFSET,
  SPIN_SPEED_OFFSET,
  FPS_OFFSET,
  UNDER_BOUND,
  TUTORIAL_INDEX,
  GRID_4_BY_2,
  GRID_3_BY_3,
  GRID_2_BY_4,
} from "./model/constants";
import SandboxController from "./components/SandboxController";
import { charaSelector } from "@/utils/nwjnsCharacter";
import { modalOpen, modalSwitch, setChild } from "@/utils/redux/modalState";
import SandboxDescription from "./components/SandboxDescription";
import ToyDescription from "./components/ToyDescription";

export default function Sandbox() {
  // console.log("re-render!");
  const dispatch = useDispatch();

  const [backgroundSize, setBackgroundSize] = useState({ width: 1920, height: 1080 });

  const screenRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const backgroundRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgShadowRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const dockerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const mouseDownState: MutableRefObject<boolean> = useRef<boolean>(false);
  const toyFocus: MutableRefObject<number> = useRef<number>(-1);
  const backgroundOffset = useRef({ left: 0, top: 0 });
  const alignRef = useRef(SandboxAlignType.Free);
  const backgroundShrinkRef = useRef(true);
  const mouseDownTime: MutableRefObject<number> = useRef<number>(0);

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
      name: "deadlock",
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
      image: charaSelector(),
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

  useEffect(() => {
    const toyMoveId = setInterval(toyMove, FPS_OFFSET, 0.2);
    window.addEventListener("resize", backgroundInitialize);
    // window.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });

    return () => {
      clearInterval(toyMoveId);
      window.removeEventListener("resize", backgroundInitialize);
    };
  }, []);

  useEffect(() => {
    toyList.current.forEach((v, i) => {
      if (v.physics.DST.X === -1 && v.physics.DST.Y === -1) {
        spread(i, false);
      }
    });

    toyList.current[TUTORIAL_INDEX].physics.FIXED = true;
    if (toyList.current[TUTORIAL_INDEX].moveRef.current)
      toyList.current[TUTORIAL_INDEX].moveRef.current.style.visibility = "hidden";

    let bgMoveId: string | number | NodeJS.Timer | undefined;

    if (backgroundRef.current !== null) {
      if (!backgroundShrinkRef.current) {
        bgMoveId = setInterval(backgroundMove, FPS_OFFSET);
      } else {
        backgroundRef.current.style.left = "0px";
        backgroundRef.current.style.top = "0px";
      }
    }

    backgroundInitialize();

    return () => {
      if (bgMoveId !== undefined) {
        clearInterval(bgMoveId);
      }
    };
  }, [backgroundShrinkRef.current]);

  const alignModeChange = useCallback((mode: SandboxAlignType) => {
    if (screenRef.current === null || bgShadowRef.current === null) return;

    alignRef.current = mode;

    if (mode === SandboxAlignType.Grid) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const screenRatio = screenWidth / screenHeight;

      let rows, cols;
      if (screenRatio > 1.4) {
        rows = GRID_4_BY_2.rows;
        cols = GRID_4_BY_2.cols;
      } else if (screenRatio > 0.7) {
        rows = GRID_3_BY_3.rows;
        cols = GRID_3_BY_3.cols;
      } else {
        rows = GRID_2_BY_4.rows;
        cols = GRID_2_BY_4.cols;
      }

      const stdWidth = Math.round(screenWidth / (cols + 1));
      const stdHeight = Math.round((screenHeight * UNDER_BOUND) / (rows + 1));
      const coors: Array<Coordinate> = [];

      for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
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

      bgShadowRef.current.style.opacity = "0.3";
    } else if (mode === SandboxAlignType.Free) {
      toyList.current.forEach((v, i) => {
        v.physics.V.vx = Math.round(Math.random() * 6) - 3;
        v.physics.V.vy = Math.round(Math.random() * 6) - 3;

        toyGravityDrop(i);
      });

      bgShadowRef.current.style.opacity = "0";
    } else if (mode === SandboxAlignType.Shake) {
      shake();
      bgShadowRef.current.style.opacity = "0";
    }
  }, []);

  const backgroundInitialize = useCallback(() => {
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

    if (!backgroundShrinkRef.current) {
      bgWidth += 160;
      bgHeight += 90;
    }

    if (backgroundSize.width !== bgWidth || backgroundSize.height !== bgHeight) {
      let offsetLeft = -(bgWidth - screenWidth) / 2;
      let offsetTop = -(bgHeight - screenHeight) / 2;

      backgroundOffset.current = { left: offsetLeft, top: offsetTop };
      backgroundRef.current.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

      setBackgroundSize({ width: bgWidth, height: bgHeight });
    }
  }, [backgroundSize]);

  const backgroundMove = useCallback(() => {
    if (screenRef.current === null || backgroundRef.current === null) return;

    const stdWidth = screenRef.current.offsetWidth / 2;
    const stdHeight = screenRef.current.offsetHeight / 2;
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
  }, []);

  const toyMove = useCallback((t?: number) => {
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

      const toyPhysics = v.physics;

      let startX = toyMoveRef.current.offsetLeft;
      let startY = toyMoveRef.current.offsetTop;

      if (startX > window.innerWidth || startY > window.innerHeight) spread(i, false);

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
        alignRef.current !== SandboxAlignType.Grid &&
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
        endY = Math.round(screenRef.current.offsetHeight * UNDER_BOUND);
      }

      toyMoveRef.current.style.left = endX + "px";
      toyMoveRef.current.style.top = endY + "px";
      toyRotateRef.current.style.transform = `rotate(${rotate}deg)`;
    });
  }, []);

  const toyGravityDrop = useCallback((index: number) => {
    const toyRef = toyList.current[index].moveRef;
    const toyPhysics = toyList.current[index].physics;

    if (toyRef.current === null || screenRef.current === null || toyPhysics.FIXED) return;

    let vx = toyPhysics.V.vx;
    let vy = toyPhysics.V.vy;

    toyPhysics.DST.X += vx;
    toyPhysics.DST.Y += vy;

    toyPhysics.V.vy += 2;

    if (
      toyFocus.current !== index &&
      (vy < 30 || toyRef.current.offsetTop < toyRef.current.offsetHeight) &&
      toyPhysics.DST.Y < Math.round(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      if (alignRef.current !== SandboxAlignType.Grid) setTimeout(toyGravityDrop, FPS_OFFSET, index);
    } else {
      if (toyFocus.current !== index) {
        toyPhysics.DST.X = toyRef.current.offsetLeft;
        toyPhysics.DST.Y = toyRef.current.offsetTop;
      }

      toyPhysics.X = [];
      toyPhysics.Y = [];
      toyPhysics.V.vx = 0;
      toyPhysics.V.vy = 0;
      toyPhysics.dR = 0;
    }
  }, []);

  const spread = useCallback((index: number, outer: boolean) => {
    if (screenRef.current === null) return;

    const toyPhysics = toyList.current[index].physics;

    if (outer) {
      toyPhysics.DST = randomCoordinate(screenRef.current.offsetWidth, -200);
    } else {
      toyPhysics.DST = randomCoordinate(screenRef.current.offsetWidth, screenRef.current.offsetHeight * UNDER_BOUND);
    }

    toyPhysics.X = [0];
    toyPhysics.Y = [0];
    toyPhysics.V = { vx: 0, vy: 0 };
    toyPhysics.dR = 0;
  }, []);

  const shake = useCallback(() => {
    toyList.current.forEach((v, i) => {
      v.physics.V.vx += Math.round(Math.random() * 30) - 15;
      v.physics.V.vy += Math.round(Math.random() * -30);

      toyGravityDrop(i);
    });
  }, []);

  const mouseDownEvent: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouseDownTime.current = Date.now();

    const focus = Number((e.target as HTMLDivElement).id.charAt(0));

    if (alignRef.current === SandboxAlignType.Grid) {
      toyFocus.current = focus;
    } else {
      toyFocus.current = focus;
      const toyMoveRef = toyList.current[focus].moveRef;
      const toyRotateRef = toyList.current[focus].rotateRef;
      const toyPhysics = toyList.current[focus].physics;

      if (toyMoveRef.current && toyRotateRef.current) {
        toyPhysics.DST.X = e.clientX;
        toyPhysics.DST.Y = e.clientY;

        toyPhysics.R = Number(toyRotateRef.current.style.transform.substring(7).split("d")[0]);
      }
    }
  };

  const touchStartEvent: TouchEventHandler<HTMLDivElement> = (e: React.TouchEvent<HTMLDivElement>) => {
    mouseDownTime.current = Date.now();

    const focus = Number((e.target as HTMLDivElement).id.charAt(0));

    if (alignRef.current === SandboxAlignType.Grid) {
      toyFocus.current = focus;
    } else {
      toyFocus.current = focus;
      const toyMoveRef = toyList.current[focus].moveRef;
      const toyRotateRef = toyList.current[focus].rotateRef;
      const toyPhysics = toyList.current[focus].physics;

      if (toyMoveRef.current && toyRotateRef.current) {
        toyPhysics.DST.X = e.touches[0].clientX;
        toyPhysics.DST.Y = e.touches[0].clientY;

        toyPhysics.R = Number(toyRotateRef.current.style.transform.substring(7).split("d")[0]);
      }
    }
  };

  const mouseUpEvent = (e: any) => {
    const focus = toyFocus.current;
    if (focus === -1) return;
    toyFocus.current = -1;

    const toyData = toyList.current[focus];
    const toyPhysics = toyData.physics;

    const clickEndTime = Date.now();

    const vx = Math.round(toyPhysics.X.reduce((sum, cur) => sum + cur, 0) * (GVT_SPEED_OFFSET * 0.7));
    const vy = Math.round(toyPhysics.Y.reduce((sum, cur) => sum + cur, 0) * GVT_SPEED_OFFSET);
    const speed = Math.abs(vx) + Math.abs(vy);

    if (clickEndTime - mouseDownTime.current < 100 && speed < 5) {
      dispatch(
        setChild((<ToyDescription name={toyData.name} link={toyData.link} Img={toyData.image} />) as JSX.Element)
      );
      dispatch(modalOpen());
    } else {
      toyPhysics.V.vx = vx;
      toyPhysics.V.vy = vy;

      toyPhysics.dR = vx * SPIN_SPEED_OFFSET;

      toyGravityDrop(focus);
    }

    e.preventDefault();
  };

  const touchEndEvent = mouseUpEvent;

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (toyFocus.current === -1) return;

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

  const touchMoveEvent: TouchEventHandler = (e: React.TouchEvent) => {
    if (toyFocus.current === -1) return;

    const endX = e.touches[0].clientX;
    const endY = e.touches[0].clientY;
    const toyPhysics = toyList.current[toyFocus.current].physics;

    toyPhysics.X.push(endX - toyPhysics.DST.X);
    toyPhysics.Y.push(endY - toyPhysics.DST.Y);
    if (toyPhysics.X.length > 5) {
      toyPhysics.X.shift();
      toyPhysics.Y.shift();
    }

    toyPhysics.DST.X = endX;
    toyPhysics.DST.Y = endY;
  };

  const logBtn = () => {
    // console.log(toyList.current);
    // const startTime = Date.now();
    // toyMove(0.2);
    // backgroundMove();
    // const endTime = Date.now();
    // console.log(startTime, endTime);
    // console.log(endTime - startTime);
  };

  const setDiscriptionModal = () => {
    dispatch(setChild((<SandboxDescription />) as JSX.Element));
    dispatch(modalSwitch());
  };

  return (
    <>
      {/* <meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1.0, user-scalable=no" /> */}
      <meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1.0" />
      <div className="sandbox-background" ref={backgroundRef}>
        <div className="sandbox-shadow" ref={bgShadowRef}></div>
        <Background width={backgroundSize.width} height={backgroundSize.height} />
      </div>
      <main
        className="sandbox-screen"
        onMouseLeave={mouseUpEvent}
        onMouseUp={mouseUpEvent}
        onMouseMove={mouseMoveEvent}
        onTouchEnd={touchEndEvent}
        onTouchMove={touchMoveEvent}
        ref={screenRef}
      >
        {toyList.current.map((v, i) => {
          return (
            <ToyComponent
              idx={i}
              toyData={v}
              mouseDownEvent={mouseDownEvent}
              touchStartEvent={touchStartEvent}
              key={i}
            />
          );
        })}
        <SandboxController
          alignRef={alignRef}
          dockerRef={dockerRef}
          backgroundShrinkRef={backgroundShrinkRef}
          backgroundInitialize={backgroundInitialize}
          alignModeChange={alignModeChange}
          setDiscriptionModal={setDiscriptionModal}
        />
      </main>
    </>
  );
}
