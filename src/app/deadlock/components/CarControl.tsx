"use client";

import { MutableRefObject, RefObject, createRef, useEffect, useRef, useState } from "react";
import { CarItem, CarType } from "../model/types";
import { FPS_OFFSET } from "@/utils/constants";

import "./components.scss";
import { BACKGROUND_HEIGHT } from "../utils/constants";

interface Props {
  sizeIndexRef: MutableRefObject<number>;
  scoreRef: RefObject<HTMLDivElement>;
}

export default function CarControl({ sizeIndexRef, scoreRef }: Props) {
  const [cars, setCars] = useState<Array<CarItem>>([]);

  const carsRef = useRef<Array<CarItem>>([]);

  const addCarInterval = useRef(1000);
  const addCarId = useRef<NodeJS.Timeout>();
  const nextKeyRef = useRef(0);
  const passedCarRef = useRef(0);

  useEffect(() => {
    addCar();
    const moveId = setInterval(moveCar, FPS_OFFSET);
    // const freeId = setInterval(freeCar, 1000);

    return () => {
      clearInterval(moveId);
      // clearInterval(freeId);
      clearTimeout(addCarId.current);
    };
  }, []);

  const addCar = () => {
    if (document.hidden) {
      addCarId.current = setTimeout(addCar, addCarInterval.current);
      return;
    }

    const carType: CarType = Math.floor(Math.random() * 4);
    const newCar: CarItem = {
      type: carType,
      carRef: createRef(),
      imgRef: createRef(),
      shadowRef: createRef(),
      key: nextKeyRef.current,
    };

    nextKeyRef.current += 1;
    carsRef.current = [...carsRef.current, newCar];

    console.log("CAR", carType);
    freeCar();

    if (scoreRef.current) scoreRef.current.textContent = `${passedCarRef.current}`;

    setCars(carsRef.current);
    addCarId.current = setTimeout(addCar, addCarInterval.current);
  };

  const moveCar = () => {
    carsRef.current.forEach((v, i) => {
      const carRef = v.carRef;
      const imgRef = v.imgRef;
      const shadowRef = v.shadowRef;
      // console.log(i);

      if (!carRef.current || !imgRef.current || !shadowRef.current) return;

      // 자동차 위치 초기화/움직임
      if (v.type === CarType.FromLeft) {
        if (carRef.current.offsetLeft === -100) {
          let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
          carRef.current.style.top = top + carRef.current.offsetHeight / 2 + 2 + "px";
          carRef.current.style.left = "-50px";

          carRef.current.className = "deadlock-car from-left";
          imgRef.current.className = "deadlock-car-image red";
        } else {
          carRef.current.style.left = carRef.current.offsetLeft + 1 + "px";
        }
      } else if (v.type === CarType.FromBottom) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.bottom = "-50px";
          carRef.current.style.left = window.innerWidth * 0.5 + carRef.current.offsetHeight / 2 + 2 + "px";

          carRef.current.className = "deadlock-car from-bottom";
          imgRef.current.className = "deadlock-car-image blue";

          shadowRef.current.style.top = "2px";
          shadowRef.current.style.left = "-2px";
        } else {
          carRef.current.style.top = carRef.current.offsetTop - 1 + "px";
        }
      } else if (v.type === CarType.FromRight) {
        if (carRef.current.offsetLeft === -100) {
          let top = BACKGROUND_HEIGHT[sizeIndexRef.current] / 18 + window.innerHeight / 2; // BG_HEIGHT * 5/9 - (BG_HEIGHT - window.innerheight) / 2
          carRef.current.style.top = top - carRef.current.offsetHeight / 2 - 2 + "px";
          carRef.current.style.left = window.innerWidth + 50 + "px";

          carRef.current.className = "deadlock-car from-right";
          imgRef.current.className = "deadlock-car-image yellow";

          shadowRef.current.style.top = "-2px";
          shadowRef.current.style.left = "-2px";
        } else {
          carRef.current.style.left = carRef.current.offsetLeft - 1 + "px";
        }
      } else if (v.type === CarType.FromTop) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = "-50px";
          carRef.current.style.left = window.innerWidth * 0.5 - carRef.current.offsetHeight / 2 - 2 + "px";

          carRef.current.className = "deadlock-car from-top";
          imgRef.current.className = "deadlock-car-image green";

          shadowRef.current.style.top = "-2px";
          shadowRef.current.style.left = "2px";
        } else {
          carRef.current.style.top = carRef.current.offsetTop + 1 + "px";
        }
      }
    });
  };

  const freeCar = () => {
    console.log(carsRef.current.map((v) => v.key));
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
      else if (scoreRef.current) passedCarRef.current += 1;
    });

    carsRef.current = newArray;
  };

  return (
    <>
      {cars.map((v, i) => {
        // console.log(i);
        return (
          <div className="deadlock-car" ref={v.carRef} key={`${v.key}car`}>
            <div className="deadlock-car-image" ref={v.imgRef} />
            <div className="deadlock-car-shadow" ref={v.shadowRef} />
          </div>
        );
      })}
    </>
  );
}
