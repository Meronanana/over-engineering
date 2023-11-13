"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { FoodRef, createFoodRef } from "../model/render";
import FoodView from "../view/FoodView";
import { aFRAME, aTurn } from "../model/constants";
import { Frame, Turn, getRandomPosition } from "../model/types";
import { Apple } from "../model/food";

// import "./natsel.scss";

interface Props {
  foodRefs: MutableRefObject<FoodRef[]>;
}

export default function FoodController({ foodRefs }: Props) {
  useEffect(() => {
    const checkEaten = setInterval(() => {
      const newFoodRefs: FoodRef[] = [];
      foodRefs.current?.forEach((v, i) => {
        if (!foodRefs.current) return;
        if (v.data.eaten === false) {
          newFoodRefs.push(v);
        }
      });
      foodRefs.current = newFoodRefs;
    }, aFRAME);

    const addFood = setInterval(() => {
      foodRefs.current.push(createFoodRef(new Apple(Turn(64), getRandomPosition())));
    }, aTurn * 4);

    return () => {
      clearInterval(checkEaten);
      clearInterval(addFood);
    };
  }, []);

  return (
    <>
      <FoodView foodRefs={foodRefs} />
    </>
  );
}
