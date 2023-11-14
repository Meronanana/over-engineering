"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { FoodRef, createFoodRef } from "../model/render";
import FoodView from "../view/FoodView";
import { FRAME_TIME, TURN_TIME } from "../model/constants";
import { Frame, Turn, getRandomPosition } from "../model/types";
import { Apple, Fish, Peach } from "../model/food";

// import "./natsel.scss";

interface Props {
  foodRefs: MutableRefObject<FoodRef[]>;
}

export default function FoodController({ foodRefs }: Props) {
  useEffect(() => {
    const checkDelete = setInterval(() => {
      const newFoodRefs: FoodRef[] = [];
      foodRefs.current?.forEach((v, i) => {
        if (!foodRefs.current) return;
        if (v.data.delete === false) {
          newFoodRefs.push(v);
        }
      });
      foodRefs.current = newFoodRefs;
    }, FRAME_TIME);

    const addFood = setInterval(() => {
      foodRefs.current.push(createFoodRef(new Apple()));
      foodRefs.current.push(createFoodRef(new Peach()));
      foodRefs.current.push(createFoodRef(new Fish()));
    }, TURN_TIME * 6);

    return () => {
      clearInterval(checkDelete);
      clearInterval(addFood);
    };
  }, []);

  return (
    <>
      <FoodView foodRefs={foodRefs} />
    </>
  );
}
