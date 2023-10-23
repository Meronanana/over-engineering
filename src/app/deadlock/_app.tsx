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

import {
  BACKGROUND_HEIGHT,
  BACKGROUND_WIDTH,
  CAR_HEIGHT,
  CAR_WIDTH,
  SIGN_CHANGE_BLOCK_TIME,
  SIGN_CHANGE_INTERVAL,
} from "./utils/constants";
import CarControl from "./components/CarControl";

import "./deadlock.scss";
import "./components/components.scss";
import { CarItem, CarType, FourDirectionRefs, Lanes } from "./model/types";
import DeadlockController from "./components/DeadlockController";

export default function Deadlock() {
  const bgRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const scoreRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const trafficLightRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const lanesRef: MutableRefObject<Lanes> = useRef<Lanes>({
    fromLeft: { TL: false, ref: createRef() },
    fromBottom: { TL: false, ref: createRef() },
    fromRight: { TL: false, ref: createRef() },
    fromTop: { TL: false, ref: createRef() },
  });
  const tlSignsRef = useRef<FourDirectionRefs>({
    fromLeft: createRef(),
    fromBottom: createRef(),
    fromRight: createRef(),
    fromTop: createRef(),
  });

  const carsRef = useRef<Array<CarItem>>([]);
  const sizeIndexRef = useRef(0);
  const carFocus = useRef(-1);
  const trafficLightEnalbe = useRef(false);

  useEffect(() => {
    initializeBackground();
    window.addEventListener("resize", initializeBackground);

    const signChangeId = setInterval(tlSignChange, SIGN_CHANGE_INTERVAL);

    return () => {
      window.removeEventListener("resize", initializeBackground);
      clearInterval(signChangeId);
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

  const tlSignChange = () => {
    const leftSignRef = tlSignsRef.current.fromLeft;
    const bottomSignRef = tlSignsRef.current.fromBottom;
    const rightSignRef = tlSignsRef.current.fromRight;
    const topSignRef = tlSignsRef.current.fromTop;
    if (
      !leftSignRef.current ||
      !bottomSignRef.current ||
      !rightSignRef.current ||
      !topSignRef.current ||
      !scoreRef.current
    )
      return;
    if (trafficLightEnalbe.current) {
      leftSignRef.current.style.opacity = "0.7";
      rightSignRef.current.style.opacity = "0.7";
      bottomSignRef.current.style.opacity = "0.7";
      topSignRef.current.style.opacity = "0.7";

      scoreRef.current.style.animation = "score-blink 2s linear 0s infinite";
      if (lanesRef.current.fromLeft.TL) {
        lanesRef.current.fromBottom.TL = true;
        lanesRef.current.fromTop.TL = true;

        bottomSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
        topSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
        setTimeout(() => {
          const leftSignRef = tlSignsRef.current.fromLeft;
          const rightSignRef = tlSignsRef.current.fromRight;
          if (!leftSignRef.current || !rightSignRef.current) return;

          lanesRef.current.fromLeft.TL = false;
          lanesRef.current.fromRight.TL = false;

          leftSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";
          rightSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";
        }, SIGN_CHANGE_BLOCK_TIME);
      } else {
        lanesRef.current.fromLeft.TL = true;
        lanesRef.current.fromRight.TL = true;

        leftSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
        rightSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
        setTimeout(() => {
          const bottomSignRef = tlSignsRef.current.fromBottom;
          const topSignRef = tlSignsRef.current.fromTop;
          if (!bottomSignRef.current || !topSignRef.current) return;

          lanesRef.current.fromBottom.TL = false;
          lanesRef.current.fromTop.TL = false;

          bottomSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";
          topSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";
        }, SIGN_CHANGE_BLOCK_TIME);
      }
    } else {
      lanesRef.current.fromLeft.TL = false;
      lanesRef.current.fromRight.TL = false;
      lanesRef.current.fromBottom.TL = false;
      lanesRef.current.fromTop.TL = false;

      leftSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
      rightSignRef.current.style.backgroundColor = "rgba(226, 92, 87, 1)";
      bottomSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";
      topSignRef.current.style.backgroundColor = "rgba(93, 132, 58, 1)";

      leftSignRef.current.style.opacity = "0";
      rightSignRef.current.style.opacity = "0";
      bottomSignRef.current.style.opacity = "0";
      topSignRef.current.style.opacity = "0";

      scoreRef.current.style.animation = "";
    }
  };

  const mouseDownEvent: MouseEventHandler = (e) => {
    let str = (e.target as HTMLDivElement).id;
    const focus = Number(str.substring(0, str.length - 3));
    carFocus.current = focus;

    carsRef.current.forEach((v) => {
      if (v.key === focus) {
        if (v.type === CarType.FromLeft && lanesRef.current.fromLeft.ref.current) {
          lanesRef.current.fromLeft.ref.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromBottom && lanesRef.current.fromBottom.ref.current) {
          lanesRef.current.fromBottom.ref.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromRight && lanesRef.current.fromRight.ref.current) {
          lanesRef.current.fromRight.ref.current.style.opacity = "0.3";
        } else if (v.type === CarType.FromTop && lanesRef.current.fromTop.ref.current) {
          lanesRef.current.fromTop.ref.current.style.opacity = "0.3";
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
        if (v.type === CarType.FromLeft && lanesRef.current.fromLeft.ref.current) {
          lanesRef.current.fromLeft.ref.current.style.opacity = "0";
        } else if (v.type === CarType.FromBottom && lanesRef.current.fromBottom.ref.current) {
          lanesRef.current.fromBottom.ref.current.style.opacity = "0";
        } else if (v.type === CarType.FromRight && lanesRef.current.fromRight.ref.current) {
          lanesRef.current.fromRight.ref.current.style.opacity = "0";
        } else if (v.type === CarType.FromTop && lanesRef.current.fromTop.ref.current) {
          lanesRef.current.fromTop.ref.current.style.opacity = "0";
        }
      }
    });

    carFocus.current = -1;
  };

  const touchEndEvent = mouseUpEvent;

  const tlMouseEvent = (e: any) => {
    if (!trafficLightRef.current) return;

    if (trafficLightEnalbe.current) {
      trafficLightRef.current.className = "traffic-light off";
      trafficLightEnalbe.current = false;
    } else {
      trafficLightRef.current.className = "traffic-light on";
      trafficLightEnalbe.current = true;
    }
  };

  const tlTouchEvent = (e: any) => {
    tlMouseEvent(e);
    e.preventDefault();
  };

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
        <div className="score" ref={scoreRef}>
          -
        </div>
        <div className="traffic-light off" ref={trafficLightRef} onMouseUp={tlMouseEvent} onTouchEnd={tlTouchEvent} />
      </div>
      <>
        <div className="deadlock-lane from-left" ref={lanesRef.current?.fromLeft.ref} />
        <div className="deadlock-lane from-bottom" ref={lanesRef.current?.fromBottom.ref} />
        <div className="deadlock-lane from-right" ref={lanesRef.current?.fromRight.ref} />
        <div className="deadlock-lane from-top" ref={lanesRef.current?.fromTop.ref} />
      </>
      <CarControl
        carsRef={carsRef}
        lanesRef={lanesRef}
        carFocus={carFocus}
        sizeIndexRef={sizeIndexRef}
        trafficLightEnalbe={trafficLightEnalbe}
        scoreRef={scoreRef}
        mouseDownEvent={mouseDownEvent}
        touchStartEvent={touchStartEvent}
      />
      <>
        <div className="deadlock-sign from-left" ref={tlSignsRef.current.fromLeft} />
        <div className="deadlock-sign from-bottom" ref={tlSignsRef.current.fromBottom} />
        <div className="deadlock-sign from-right" ref={tlSignsRef.current.fromRight} />
        <div className="deadlock-sign from-top" ref={tlSignsRef.current.fromTop} />
      </>
      <DeadlockController />
    </main>
  );
}
