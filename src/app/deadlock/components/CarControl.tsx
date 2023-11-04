"use client";

import {
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  TouchEventHandler,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { CarItem, CarType, Lanes } from "../model/types";
import { FPS_OFFSET } from "@/utils/constants";

import "./components.scss";
import { BACKGROUND_HEIGHT, CAR_SPEED } from "../utils/constants";
import { CarBox, isObjectInFront, lerp } from "@/utils/physicalEngine";

interface Props {
  carsRef: MutableRefObject<Array<CarItem>>;
  lanesRef: MutableRefObject<Lanes>;
  carFocus: MutableRefObject<number>;
  sizeIndexRef: MutableRefObject<number>;
  trafficLightEnalbe: MutableRefObject<boolean>;
  scoreRef: RefObject<HTMLDivElement>;
  mouseDownEvent: MouseEventHandler;
  touchStartEvent: TouchEventHandler;
}

export default function CarControl({
  carsRef,
  lanesRef,
  carFocus,
  sizeIndexRef,
  trafficLightEnalbe,
  scoreRef,
  mouseDownEvent,
  touchStartEvent,
}: Props) {
  const [cars, setCars] = useState<Array<CarItem>>([]);

  const windowSizeRef = useRef({ width: 0, height: 0 });
  const addCarInterval = useRef(3000);
  const addCarId = useRef<NodeJS.Timeout>();
  const nextKeyRef = useRef(0);
  const passedCarRef = useRef(0);

  useEffect(() => {
    addCar();
    const moveId = setInterval(moveCar, FPS_OFFSET);

    resize();
    window.addEventListener("resize", resize);
    // window.addEventListener("", resize);
    // const freeId = setInterval(freeCar, 1000);

    return () => {
      clearInterval(moveId);
      // clearInterval(freeId);
      clearTimeout(addCarId.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const resize = () => {
    carsRef.current.forEach((v, i) => {
      const carRef = v.carRef;
      if (!carRef.current) return;

      if (v.type === CarType.FromLeft) {
        let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
        carRef.current.style.top = top + BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
      } else if (v.type === CarType.FromBottom) {
        carRef.current.style.left = window.innerWidth * 0.5 + BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
      } else if (v.type === CarType.FromRight) {
        let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
        carRef.current.style.top = top - BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
      } else if (v.type === CarType.FromTop) {
        carRef.current.style.left = window.innerWidth * 0.5 - BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
      }
    });

    windowSizeRef.current = { width: window.innerWidth, height: window.innerHeight };
  };

  const addCar = () => {
    if (document.hidden) {
      addCarId.current = setTimeout(addCar, addCarInterval.current);
      return;
    }

    const carType: CarType = Math.floor(Math.random() * 4);

    // 꽉찬 라인에 CarItem 추가하지 않기
    let laneFullFlag = false;
    carsRef.current.forEach((v) => {
      const carRef = v.carRef;

      if (!carRef.current) return;

      if (v.type === carType) {
        if (carType === CarType.FromLeft) {
          laneFullFlag = carRef.current.offsetLeft < 0;
        } else if (carType === CarType.FromBottom) {
          laneFullFlag = carRef.current.offsetTop > window.innerHeight;
        } else if (carType === CarType.FromRight) {
          laneFullFlag = carRef.current.offsetLeft > window.innerWidth;
        } else if (carType === CarType.FromTop) {
          laneFullFlag = carRef.current.offsetTop < 0;
        }
      }
    });
    if (laneFullFlag) {
      addCarId.current = setTimeout(addCar, addCarInterval.current);
      return;
    }

    const newCar: CarItem = {
      type: carType,
      carRef: createRef(),
      imgRef: createRef(),
      shadowRef: createRef(),
      key: nextKeyRef.current,
    };

    nextKeyRef.current += 1;
    carsRef.current = [...carsRef.current, newCar];

    // console.log("CAR", carType);
    freeCar();

    if (scoreRef.current) scoreRef.current.textContent = `${passedCarRef.current}`;

    setCars(carsRef.current);
    addCarId.current = setTimeout(addCar, addCarInterval.current);
  };

  const moveCar = () => {
    const data: Array<CarBox | null> = carsRef.current.map((v, i) => {
      if (v.carRef.current) {
        if (v.type % 2 === 0) {
          return {
            x: v.carRef.current.offsetLeft,
            y: v.carRef.current.offsetTop,
            w: v.carRef.current.offsetWidth,
            h: v.carRef.current.offsetHeight,
            type: v.type,
            index: v.key,
          };
        } else {
          return {
            x: v.carRef.current.offsetLeft,
            y: v.carRef.current.offsetTop,
            w: v.carRef.current.offsetHeight,
            h: v.carRef.current.offsetWidth,
            type: v.type,
            index: v.key,
          };
        }
      } else {
        return null;
      }
    });

    carsRef.current.forEach((v, i) => {
      const carRef = v.carRef;
      const imgRef = v.imgRef;
      const shadowRef = v.shadowRef;
      // console.log(i);

      if (!carRef.current || !imgRef.current || !shadowRef.current || v.key === carFocus.current) return;

      // 자동차 위치 초기화/움직임
      if (v.type === CarType.FromLeft) {
        if (carRef.current.offsetLeft === -100) {
          let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
          carRef.current.style.top = top + BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
          carRef.current.style.left = "-50px";

          carRef.current.className = "deadlock-car from-left";
          imgRef.current.className = "deadlock-car-image red";
        } else {
          if (isObjectInFront(data, i) || (lanesRef.current.fromLeft.TL && isOnTLArea(v))) return;
          else carRef.current.style.left = carRef.current.offsetLeft + CAR_SPEED[sizeIndexRef.current] + "px";
        }
      } else if (v.type === CarType.FromBottom) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = window.innerHeight + 50 + "px";
          carRef.current.style.left = window.innerWidth * 0.5 + BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";

          carRef.current.className = "deadlock-car from-bottom";
          imgRef.current.className = "deadlock-car-image blue";

          shadowRef.current.style.top = "2px";
          shadowRef.current.style.left = "-2px";
        } else {
          if (isObjectInFront(data, i) || (lanesRef.current.fromBottom.TL && isOnTLArea(v))) return;
          else carRef.current.style.top = carRef.current.offsetTop - CAR_SPEED[sizeIndexRef.current] + "px";
        }
      } else if (v.type === CarType.FromRight) {
        if (carRef.current.offsetLeft === -100) {
          let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
          carRef.current.style.top = top - BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";
          carRef.current.style.left = window.innerWidth + 50 + "px";

          carRef.current.className = "deadlock-car from-right";
          imgRef.current.className = "deadlock-car-image yellow";

          shadowRef.current.style.top = "-2px";
          shadowRef.current.style.left = "-2px";
        } else {
          if (isObjectInFront(data, i) || (lanesRef.current.fromRight.TL && isOnTLArea(v))) return;
          else carRef.current.style.left = carRef.current.offsetLeft - CAR_SPEED[sizeIndexRef.current] + "px";
        }
      } else if (v.type === CarType.FromTop) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = "-50px";
          carRef.current.style.left = window.innerWidth * 0.5 - BACKGROUND_HEIGHT[sizeIndexRef.current] / 72 + "px";

          carRef.current.className = "deadlock-car from-top";
          imgRef.current.className = "deadlock-car-image green";

          shadowRef.current.style.top = "-2px";
          shadowRef.current.style.left = "2px";
        } else {
          if (isObjectInFront(data, i) || (lanesRef.current.fromTop.TL && isOnTLArea(v))) return;
          else carRef.current.style.top = carRef.current.offsetTop + CAR_SPEED[sizeIndexRef.current] + "px";
        }
      }
    });
  };

  const freeCar = () => {
    // console.log(carsRef.current.map((v) => v.key));
    const newArray: CarItem[] = [];
    carsRef.current.forEach((v, i) => {
      const carRef = v.carRef;
      let flag = false;

      // 통과한 자동차 체크
      if (carRef.current) {
        if (v.type === CarType.FromLeft) {
          if (carRef.current.offsetLeft >= window.innerWidth + 50) {
            flag = true;
          }
        } else if (v.type === CarType.FromBottom) {
          if (carRef.current.offsetTop < -50) {
            flag = true;
            // carsRef.current = [...carsRef.current].splice(i);
          }
        } else if (v.type === CarType.FromRight) {
          if (carRef.current.offsetLeft < -50) {
            flag = true;
            // carsRef.current = [...carsRef.current].splice(i);
          }
        } else if (v.type === CarType.FromTop) {
          if (carRef.current.offsetTop > window.innerHeight + 50) {
            flag = true;
            // carsRef.current = [...carsRef.current].splice(i);
          }
        }
      }

      if (!flag) newArray.push(v);
      else if (scoreRef.current) {
        if (!trafficLightEnalbe.current) passedCarRef.current += 1;

        const numOfCars = passedCarRef.current;
        // addCarInterval.current = 3000 / (Math.pow(numOfCars / 10, 0.5) + 1);  // 꽤 주기 증가 속도 빠름
        // addCarInterval.current = 3000 / (Math.log10(numOfCars + 1) + 1);
        // addCarInterval.current = 3000 / (Math.log1p(numOfCars) + 1);
        addCarInterval.current = 3000 / lerp(Math.log10(numOfCars + 1) + 1, Math.log1p(numOfCars) + 1, 0.115);
      }
    });

    carsRef.current = newArray;
  };

  const isOnTLArea = (carItem: CarItem): boolean => {
    const carRef = carItem.carRef;
    if (!carRef.current) return false;

    if (carItem.type === CarType.FromLeft) {
      if (
        carRef.current.offsetLeft < window.innerWidth / 2 - (carRef.current.offsetWidth * 7) / 5 + 5 &&
        carRef.current.offsetLeft > window.innerWidth / 2 - (carRef.current.offsetWidth * 7) / 5 - 5
      ) {
        return true;
      }
    } else if (carItem.type === CarType.FromBottom) {
      let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2;
      if (
        carRef.current.offsetTop < top + (carRef.current.offsetWidth * 7) / 5 + 5 &&
        carRef.current.offsetTop > top + (carRef.current.offsetWidth * 7) / 5 - 5
      ) {
        return true;
      }
    } else if (carItem.type === CarType.FromRight) {
      if (
        carRef.current.offsetLeft < window.innerWidth / 2 + (carRef.current.offsetWidth * 7) / 5 + 5 &&
        carRef.current.offsetLeft > window.innerWidth / 2 + (carRef.current.offsetWidth * 7) / 5 - 5
      ) {
        return true;
      }
    } else if (carItem.type === CarType.FromTop) {
      let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2;
      if (
        carRef.current.offsetTop < top - (carRef.current.offsetWidth * 7) / 5 + 5 &&
        carRef.current.offsetTop > top - (carRef.current.offsetWidth * 7) / 5 - 5
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {cars.map((v, i) => {
        // console.log(i);
        return (
          <div
            className="deadlock-car"
            ref={v.carRef}
            key={`${v.key}car`}
            id={`${v.key}car`}
            onMouseDown={mouseDownEvent}
            onTouchStart={touchStartEvent}
          >
            <div className="deadlock-car-image" ref={v.imgRef} />
            <div className="deadlock-car-shadow" ref={v.shadowRef} />
          </div>
        );
      })}
    </>
  );
}
