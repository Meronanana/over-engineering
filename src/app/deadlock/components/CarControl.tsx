"use client";

import { createRef, useEffect, useRef, useState } from "react";
import { CarItem, CarType } from "../model/types";
import { FPS_OFFSET } from "@/utils/constants";

import "./components.scss";

interface Props {}

export default function CarControl() {
  const [cars, setCars] = useState<Array<CarItem>>([]);

  const carsRef = useRef<Array<CarItem>>([]);

  const addCarInterval = useRef(1000);
  const addCarId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    addCar();
    const moveId = setInterval(moveCar, FPS_OFFSET);

    return () => {
      clearInterval(moveId);
      clearTimeout(addCarId.current);
    };
  }, []);

  const addCar = () => {
    const carType: CarType = Math.floor(Math.random() * 4);
    const newCar: CarItem = { type: carType, ref: createRef() };

    carsRef.current = [...carsRef.current, newCar];

    console.log("CAR", carType);
    setCars(carsRef.current);
    addCarId.current = setTimeout(addCar, addCarInterval.current);
  };

  const moveCar = () => {
    carsRef.current.forEach((v, i) => {
      const carRef = v.ref;
      // console.log(i);

      if (!carRef.current) return;

      if (v.type === CarType.FromLeft) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = window.innerHeight * 0.6 + "px";
          carRef.current.style.left = "-50px";
        } else {
          carRef.current.style.left = carRef.current.offsetLeft + 1 + "px";
        }
      } else if (v.type === CarType.FromBottom) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.bottom = "-50px";
          carRef.current.style.left = window.innerWidth * 0.5 + "px";
        } else {
          carRef.current.style.top = carRef.current.offsetTop - 1 + "px";
        }
      } else if (v.type === CarType.FromRight) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = window.innerHeight * 0.6 + "px";
          carRef.current.style.left = window.innerWidth + 50 + "px";
        } else {
          carRef.current.style.left = carRef.current.offsetLeft - 1 + "px";
        }
      } else if (v.type === CarType.FromTop) {
        if (carRef.current.offsetLeft === -100) {
          carRef.current.style.top = "-50px";
          carRef.current.style.left = window.innerWidth * 0.5 + "px";
        } else {
          carRef.current.style.top = carRef.current.offsetTop + 1 + "px";
        }
      }
    });
  };

  return (
    <>
      {cars.map((v, i) => {
        console.log(i);
        return <div className="deadlock-car" ref={v.ref} key={`${i}car`} />;
      })}
    </>
  );
}
