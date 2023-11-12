"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { FoodRef } from "../model/render";
import FoodView from "../view/FoodView";
import { aFRAME } from "../model/constants";

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

    return () => {
      clearInterval(checkEaten);
    };
  }, []);

  return (
    <>
      <FoodView foodRefs={foodRefs} />
    </>
  );
}
