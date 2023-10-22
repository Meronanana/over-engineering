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
} from "react";
import Link from "next/link";

import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH, CAR_HEIGHT, CAR_WIDTH } from "./utils/constants";
import CarControl from "./components/CarControl";

import "./deadlock.scss";
import "./components/components.scss";
import { CarItem, CarType, Lanes } from "./model/types";

export default function Deadlock() {
  const bgRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const scoreRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const lanesRef: MutableRefObject<Lanes> = useRef<Lanes>({
    fromLeft: createRef(),
    fromBottom: createRef(),
    fromRight: createRef(),
    fromTop: createRef(),
  });

  const carsRef = useRef<Array<CarItem>>([]);
  const sizeIndexRef = useRef(0);
  const carFocus = useRef(-1);

  useEffect(() => {
    initializeBackground();
    window.addEventListener("resize", initializeBackground);

    return () => {
      window.removeEventListener("resize", initializeBackground);
    };
  }, []);

  const initializeBackground = () => {
    if (!bgRef.current) return;

    const screenRatio = window.innerWidth / window.innerHeight;

    if (screenRatio < 16 / 9) {
      for (let i = 0; i < BACKGROUND_HEIGHT.length; i++) {
        if (window.innerHeight <= BACKGROUND_HEIGHT[i]) {
          sizeIndexRef.current = i;
          break;
        }
      }
    } else {
      for (let i = 0; i < BACKGROUND_WIDTH.length; i++) {
        if (window.innerWidth <= BACKGROUND_WIDTH[i]) {
          sizeIndexRef.current = i;
          break;
        }
      }
    }
    document.documentElement.style.setProperty("--bg-width", `${BACKGROUND_WIDTH[sizeIndexRef.current]}px`);
    document.documentElement.style.setProperty("--bg-height", `${BACKGROUND_HEIGHT[sizeIndexRef.current]}px`);
    document.documentElement.style.setProperty("--car-width", `${CAR_WIDTH[sizeIndexRef.current]}px`);
    document.documentElement.style.setProperty("--car-height", `${CAR_HEIGHT[sizeIndexRef.current]}px`);
  };

  const mouseDownEvent: MouseEventHandler = (e) => {
    let str = (e.target as HTMLDivElement).id;
    const focus = Number(str.substring(0, str.length - 3));
    carFocus.current = focus;

    carsRef.current.forEach((v) => {
      if (v.key === focus) {
        if (v.type === CarType.FromLeft && lanesRef.current.fromLeft.current) {
          lanesRef.current.fromLeft.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromBottom && lanesRef.current.fromBottom.current) {
          lanesRef.current.fromBottom.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromRight && lanesRef.current.fromRight.current) {
          lanesRef.current.fromRight.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromTop && lanesRef.current.fromTop.current) {
          lanesRef.current.fromTop.current.style.opacity = "0.3";
        }
      }
    });
  };

  const touchStartEvent: TouchEventHandler = (e) => mouseDownEvent(e as any);

  const mouseMoveEvent = (e: React.MouseEvent) => {
    const focus = carFocus.current;
    if (focus === -1) return;

    let carItem: CarItem | undefined = undefined;
    carsRef.current.forEach((v) => {
      if (v.key === focus) carItem = v;
    });

    if (carItem === undefined) return;
    carItem = carItem as CarItem;
    if (!carItem.carRef.current) return;

    const moveX = e.movementX;
    const moveY = e.movementY;
    if (carItem.type === CarType.FromLeft) {
      if (moveX < 0) carItem.carRef.current.style.left = carItem.carRef.current.offsetLeft + moveX + "px";
    } else if (carItem.type === CarType.FromBottom) {
      if (moveY > 0) carItem.carRef.current.style.top = carItem.carRef.current.offsetTop + moveY + "px";
    } else if (carItem.type === CarType.FromRight) {
      if (moveX > 0) carItem.carRef.current.style.left = carItem.carRef.current.offsetLeft + moveX + "px";
    } else if (carItem.type === CarType.FromTop) {
      if (moveY < 0) carItem.carRef.current.style.top = carItem.carRef.current.offsetTop + moveY + "px";
    }
  };

  const touchMoveEvent = (e: React.TouchEvent) => {
    const focus = carFocus.current;
    if (focus === -1) return;

    let carItem: CarItem | undefined = undefined;
    carsRef.current.forEach((v) => {
      if (v.key === focus) carItem = v;
    });

    if (carItem === undefined) return;
    carItem = carItem as CarItem;
    if (!carItem.carRef.current) return;

    const moveX = e.touches[0].clientX - carItem.carRef.current.offsetLeft;
    const moveY = e.touches[0].clientY - carItem.carRef.current.offsetTop;
    if (carItem.type === CarType.FromLeft) {
      if (moveX < 0) carItem.carRef.current.style.left = carItem.carRef.current.offsetLeft + moveX + "px";
    } else if (carItem.type === CarType.FromBottom) {
      if (moveY > 0) carItem.carRef.current.style.top = carItem.carRef.current.offsetTop + moveY + "px";
    } else if (carItem.type === CarType.FromRight) {
      if (moveX > 0) carItem.carRef.current.style.left = carItem.carRef.current.offsetLeft + moveX + "px";
    } else if (carItem.type === CarType.FromTop) {
      if (moveY < 0) carItem.carRef.current.style.top = carItem.carRef.current.offsetTop + moveY + "px";
    }
  };

  const mouseUpEvent = () => {
    const focus = carFocus.current;
    if (focus === -1) return;

    carsRef.current.forEach((v) => {
      if (v.key === focus) {
        if (v.type === CarType.FromLeft && lanesRef.current.fromLeft.current) {
          lanesRef.current.fromLeft.current.style.opacity = "0";
        } else if (v.type === CarType.FromBottom && lanesRef.current.fromBottom.current) {
          lanesRef.current.fromBottom.current.style.opacity = "0";
        } else if (v.type === CarType.FromRight && lanesRef.current.fromRight.current) {
          lanesRef.current.fromRight.current.style.opacity = "0";
        } else if (v.type === CarType.FromTop && lanesRef.current.fromTop.current) {
          lanesRef.current.fromTop.current.style.opacity = "0";
        }
      }
    });

    carFocus.current = -1;
  };

  const touchEndEvent = mouseUpEvent;

  return (
    <main
      className="deadlock-screen"
      onMouseMove={mouseMoveEvent}
      onMouseUp={mouseUpEvent}
      onTouchMove={touchMoveEvent}
      onTouchEnd={touchEndEvent}
    >
      <div className="deadlock-background" ref={bgRef} />
      <div className="deadlock-top-menu">
        <div className="score" ref={scoreRef} />
        <div className="traffic-light" />
      </div>
      <CarControl
        carsRef={carsRef}
        carFocus={carFocus}
        sizeIndexRef={sizeIndexRef}
        scoreRef={scoreRef}
        mouseDownEvent={mouseDownEvent}
        touchStartEvent={touchStartEvent}
      />
      <Link href={"/sandbox-alt"} className="temp">
        뒤로가기
      </Link>
      <div className="deadlock-lane from-left" ref={lanesRef.current?.fromLeft} />
      <div className="deadlock-lane from-bottom" ref={lanesRef.current?.fromBottom} />
      <div className="deadlock-lane from-right" ref={lanesRef.current?.fromRight} />
      <div className="deadlock-lane from-top" ref={lanesRef.current?.fromTop} />
    </main>
  );
}
