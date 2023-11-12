"use client";

import { RefObject, useEffect, useState } from "react";
import { FoodRef } from "../model/render";
import { TILE_SIZE } from "../model/constants";

import "./foodView.scss";

interface Props {
  foodRefs: RefObject<FoodRef[]>;
}

export default function FoodView({ foodRefs }: Props) {
  const [foods, setFoods] = useState<FoodRef[]>();

  useEffect(() => {
    if (!foodRefs.current) return;
    setFoods(foodRefs.current);
  }, []);

  console.log(foods);

  return (
    <div className="food-area">
      {foods !== undefined ? (
        foods.map((v, i) => {
          return (
            <div
              className={`food-${v.data.foodType}`}
              ref={v.mainRef}
              key={`${0}${i}`}
              style={{ top: `${v.data.position.Y * TILE_SIZE}px`, left: `${v.data.position.X * TILE_SIZE}px` }}
            ></div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
