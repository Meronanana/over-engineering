"use client";

import {
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDispatch } from "react-redux";

import {
  SandboxAlignType,
  Toy,
  defaultToyList,
  trayLeftItem,
  trayRightItem,
  sandFrontItem,
  sandBackItem,
} from "./model/types";
import {
  GVT_SPEED_OFFSET,
  SPIN_SPEED_OFFSET,
  UNDER_BOUND,
  TUTORIAL_INDEX,
  GRID_4_BY_2,
  GRID_3_BY_3,
  GRID_2_BY_4,
  zIndexs,
} from "./model/constants";
import { sleep } from "@/utils/utilFunctions";
import { Circle, Coordinate, lerp, randomCoordinate, reactionByCircleCollision } from "@/utils/physicalEngine";
import { modalOpen, modalSwitch, setChild } from "@/utils/redux/modalState";

import Background from "/public/assets/images/sandbox/sandbox-background.svg";

import ToyComponent from "./components/ToyComponent";
import SandboxItemComponent from "./components/SandboxItemComponent";
import SandboxController from "./components/SandboxController";
import SandboxDescription from "./components/SandboxDescription";
import ToyDescription from "./components/ToyDescription";
import { FPS_OFFSET } from "@/utils/constants";

import "./sandbox.scss";

export default function Sandbox() {
  // console.log("re-render!");
  const dispatch = useDispatch();

  const screenRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const bgShadowRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const dockerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const toyFocus: MutableRefObject<number> = useRef<number>(-1);
  const alignRef = useRef(SandboxAlignType.Free);
  const mouseDownTime: MutableRefObject<number> = useRef<number>(0);

  const toyList = useRef<Array<Toy>>([...defaultToyList]);

  useEffect(() => {
    toyList.current[TUTORIAL_INDEX].physics.FIXED = true;
    if (toyList.current[TUTORIAL_INDEX].moveRef.current) {
      toyList.current[TUTORIAL_INDEX].moveRef.current.style.visibility = "hidden";
      toyList.current[TUTORIAL_INDEX].moveRef.current.style.top = "-100px";
    }

    toyList.current.forEach((v, i) => {
      setTimeout(async () => {
        if (v.physics.DST.X === -1) {
          toyFocus.current = i;

          v.physics.DST = {
            X: window.innerWidth * -0.1,
            Y: window.innerHeight * 0.5 - window.innerHeight * 0.3 * Math.random(),
          };

          const toyMoveRef = v.moveRef;
          if (toyMoveRef.current === null) return;

          await sleep(300);

          v.physics.V = {
            vx: Math.floor(window.innerWidth * 0.02 * (Math.random() + 1)),
            vy: Math.floor(window.innerHeight * -0.01 * (Math.random() + 2)),
          };
          toyFocus.current = -1;
          toyGravityDrop(i);
        }
      }, i * 500);
    });

    backgroundInitialize();

    const toyMoveId = setInterval(toyMove, FPS_OFFSET, 0.2);
    window.addEventListener("resize", backgroundInitialize);

    return () => {
      clearInterval(toyMoveId);
      // window.removeEventListener("resize", backgroundInitialize);
    };
  }, []);

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
      toyList.current.forEach((v) => {
        if (v.moveRef.current) {
          v.moveRef.current.style.zIndex = zIndexs.gridToy;
        }
      });
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
    if (screenRef.current === null) return;

    const screenWidth = screenRef.current.offsetWidth;
    const screenHeight = screenRef.current.offsetHeight;
    const sizeRatio = screenHeight / 2160;
    const screenRatio = screenWidth / screenHeight;

    let trayWidth = sizeRatio * trayLeftItem.width;
    let trayHeight = sizeRatio * trayLeftItem.height;
    let trayGap: number;

    if (screenRatio < 16 / 9) {
      trayGap = Math.floor(screenWidth * 0.11 * (screenRatio / (16 / 9)));
    } else {
      trayGap = screenWidth / 2 - trayWidth;
    }

    const trayLeftRef = trayLeftItem.ref;
    if (trayLeftRef.current === null) return;

    trayLeftRef.current.style.width = sizeRatio * trayLeftItem.width + "px";
    trayLeftRef.current.style.height = trayHeight + "px";

    trayLeftRef.current.style.left = trayGap + "px";
    trayLeftRef.current.style.top = Math.floor(window.innerHeight * 0.6) + "px";

    const trayRightRef = trayRightItem.ref;
    if (trayRightRef.current === null) return;

    trayRightRef.current.style.width = sizeRatio * trayRightItem.width + "px";
    trayRightRef.current.style.height = trayHeight + "px";

    trayRightRef.current.style.right = trayGap + "px";
    trayRightRef.current.style.top = Math.floor(window.innerHeight * 0.6) + "px";

    const sandFrontRef = sandFrontItem.ref;
    if (sandFrontRef.current === null) return;

    sandFrontRef.current.style.width = screenWidth - trayGap * 2 + "px";
    sandFrontRef.current.style.height = trayHeight + "px";

    sandFrontRef.current.style.left = trayGap + "px";
    sandFrontRef.current.style.top = Math.floor(window.innerHeight * 0.6) + "px";

    const sandBackRef = sandBackItem.ref;
    if (sandBackRef.current === null) return;

    sandBackRef.current.style.width = screenWidth - trayGap * 2 + "px";
    sandBackRef.current.style.height = trayHeight + "px";

    sandBackRef.current.style.left = trayGap + "px";
    sandBackRef.current.style.top = Math.floor(window.innerHeight * 0.6) + "px";
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
      if (v.physics.FIXED || v.physics.DST.X === -1) return;

      const toyMoveRef = v.moveRef;
      const toyRotateRef = v.rotateRef;
      if (toyMoveRef.current === null || screenRef.current === null || toyRotateRef.current === null) return;

      const toyPhysics = v.physics;

      let startX = toyMoveRef.current.offsetLeft;
      let startY = toyMoveRef.current.offsetTop;

      // if (startX > window.innerWidth || startY > window.innerHeight) spread(i, false);

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

      // const toyWidth = toyMoveRef.current.offsetWidth;
      // const toyHeight = toyMoveRef.current.offsetHeight;

      // // 벽 충돌 감지
      // let hitWall = false;
      // if (toyMoveRef.current.offsetLeft > toyWidth / 2) {
      //   if (screenRef.current.offsetWidth - toyWidth / 2 < endX) {
      //     endX = screenRef.current.offsetWidth - toyWidth / 2;
      //     hitWall = true;
      //   } else if (endX < toyWidth / 2) {
      //     endX = toyWidth / 2;
      //     hitWall = true;
      //   }
      // }
      // if (hitWall) {
      //   toyPhysics.DST.X = endX;
      //   toyPhysics.V.vx = -toyPhysics.V.vx / 2;
      //   toyPhysics.dR = toyPhysics.dR / 2;
      // }

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
        endY = Math.floor(screenRef.current.offsetHeight * UNDER_BOUND);
      }

      // DOM 컨트롤
      toyMoveRef.current.style.left = `${endX}px`;
      toyMoveRef.current.style.top = `${endY}px`;
      toyRotateRef.current.style.transform = `rotate(${rotate}deg)`;

      // if (!backgroundRef.current) return;
      // let offsetLeft = (backgroundRef.current.offsetWidth - window.innerWidth) / 2 + endX - toyWidth / 2 - 9;
      // let offsetTop = (backgroundRef.current.offsetHeight - window.innerHeight) / 2 + endY + toyHeight / 4 + 4;
      // toyLayerRef.current.style.backgroundPosition = `-${Math.floor(offsetLeft)}px -${Math.floor(offsetTop)}px`;
      // toyLayerRef.current.style.borderRadius = `${Math.floor(Math.random() * 20) + 30}%`;

      // if (i !== toyFocus.current && alignRef.current !== SandboxAlignType.Grid && backgroundRef.current) {
      //   toyMoveRef.current.style.zIndex = `${Math.floor(
      //     ((toyMoveRef.current.offsetTop + toyMoveRef.current.offsetHeight / 2) / backgroundRef.current.offsetHeight) *
      //       100
      //   )}`;
      // }
    });
  }, []);

  const toyGravityDrop = useCallback((index: number) => {
    const toyMoveRef = toyList.current[index].moveRef;
    const toyPhysics = toyList.current[index].physics;

    if (!toyMoveRef.current || !screenRef.current || toyPhysics.FIXED) return;

    let vx = toyPhysics.V.vx;
    let vy = toyPhysics.V.vy;

    toyPhysics.DST.X += vx;
    toyPhysics.DST.Y += vy;

    toyPhysics.V.vy += 2;

    if (
      toyFocus.current !== index &&
      toyMoveRef.current.offsetTop < Math.floor(screenRef.current.offsetHeight * UNDER_BOUND)
    ) {
      if (alignRef.current !== SandboxAlignType.Grid) setTimeout(toyGravityDrop, FPS_OFFSET, index);
    } else {
      toyMoveRef.current.style.zIndex = zIndexs.normalToy;
      toyPhysics.DST.X = toyMoveRef.current.offsetLeft;
      toyPhysics.DST.Y = toyMoveRef.current.offsetTop;

      toyPhysics.X = [];
      toyPhysics.Y = [];
      toyPhysics.V.vx = 0;
      toyPhysics.V.vy = 0;
      toyPhysics.dR = 0;
    }
  }, []);

  const spread = (index: number, outer: boolean) => {
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
  };

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

        toyMoveRef.current.style.zIndex = zIndexs.pickedToy;
        toyRotateRef.current.style.backgroundColor = "rgba(128, 128, 128, 0.25)";
        toyRotateRef.current.style.boxShadow = "0px 0px 20px 10px rgba(128, 128, 128, 0.3)";
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

        toyMoveRef.current.style.zIndex = zIndexs.pickedToy;
        toyRotateRef.current.style.backgroundColor = "rgba(128, 128, 128, 0.25)";
        toyRotateRef.current.style.boxShadow = "0px 0px 20px 10px rgba(128, 128, 128, 0.3)";
      }
    }
  };

  const mouseUpEvent = (e: any) => {
    const focus = toyFocus.current;
    if (focus === -1) return;
    toyFocus.current = -1;

    const toyData = toyList.current[focus];
    const toyRotateRef = toyData.rotateRef;
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

    if (toyRotateRef.current) {
      toyRotateRef.current.style.backgroundColor = "";
      toyRotateRef.current.style.boxShadow = "";
    }

    e.preventDefault();
  };

  const touchEndEvent = mouseUpEvent;

  const mouseMoveEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (toyFocus.current === -1 || alignRef.current === SandboxAlignType.Grid) return;

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
    if (toyFocus.current === -1 || alignRef.current === SandboxAlignType.Grid) return;

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
      <main
        className="sandbox-screen"
        onMouseLeave={mouseUpEvent}
        onMouseUp={mouseUpEvent}
        onMouseMove={mouseMoveEvent}
        onTouchEnd={touchEndEvent}
        onTouchMove={touchMoveEvent}
        ref={screenRef}
      >
        <div className="sandbox-shadow" ref={bgShadowRef}></div>
        <div className="sandbox-sand-back" ref={sandBackItem.ref}>
          <sandBackItem.image />
        </div>
        <div className="sandbox-sand-front" ref={sandFrontItem.ref}>
          <sandFrontItem.image />
        </div>
        <div className="sandbox-tray-left" ref={trayLeftItem.ref}>
          <trayLeftItem.image />
        </div>
        <div className="sandbox-tray-right" ref={trayRightItem.ref}>
          <trayRightItem.image />
        </div>
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
          alignModeChange={alignModeChange}
          setDiscriptionModal={setDiscriptionModal}
        />
      </main>
    </>
  );
}
