"use client";

import { createRef, useEffect, useRef, useState } from "react";
import { CarItem, CarType } from "../model/types";

interface Props {}

export default function CarControl() {
  const [cars, setCars] = useState<Array<CarItem>>([]);

  const addCarInterval = useRef(2000);

  useEffect(() => {
    addCar();
  }, []);

  const addCar = () => {
    const carType: CarType = Math.floor(Math.random() * 4);
    const newCar: CarItem = { type: carType, ref: createRef() };

    setCars((state) => [...state, newCar]);
    setTimeout(addCar, addCarInterval.current);
  };
  return (
    <>
      {cars.map((v, i) => (
        <div key={`${i}car`}></div>
      ))}
    </>
  );
}
