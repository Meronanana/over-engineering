"use client";

import { RefObject, useEffect, useState } from "react";
import { FoodRef } from "../model/render";
import { TILE_SIZE, aFRAME as FRAME_TIME } from "../model/constants";

import "./foodView.scss";
import { Frame } from "../model/types";

interface Props {
  foodRefs: RefObject<FoodRef[]>;
}

export default function FoodView({ foodRefs }: Props) {
  const [foods, setFoods] = useState<FoodRef[]>();

  useEffect(() => {
    const renderInterval = setInterval(() => {
      if (!foodRefs.current) return;
      setFoods(foodRefs.current);

      // console.log(foodRefs.current);
    }, FRAME_TIME * Frame(24));

    return () => {
      clearInterval(renderInterval);
    };
  }, []);

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