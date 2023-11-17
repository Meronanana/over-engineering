"use client";

import { RefObject, useEffect, useState } from "react";
import { FoodRef } from "../model/render";
import { TILE_SIZE, FRAME_TIME as FRAME_TIME, TURN_TIME } from "../model/constants";

import "./foodView.scss";
import { Frame } from "../model/types";

interface Props {
  foodRefs: RefObject<FoodRef[]>;
  sizeIndex: RefObject<number>;
}

export default function FoodView({ foodRefs, sizeIndex }: Props) {
  const [foods, setFoods] = useState<FoodRef[]>();

  useEffect(() => {
    const renderInterval = setInterval(() => {
      if (!foodRefs.current) return;
      setFoods(foodRefs.current);
    }, FRAME_TIME * 6);

    const animateInterval = setInterval(() => {
      if (!foodRefs.current) return;
      foodRefs.current.forEach((v) => {
        let idx = v.data.spriteIndexGenerator.next().value;

        if (!v.mainRef.current || sizeIndex.current === null) return;
        let ix = TILE_SIZE[sizeIndex.current] * v.data.spriteState[1];
        let iy = TILE_SIZE[sizeIndex.current] * v.data.spriteState[0];
        v.mainRef.current.style.backgroundPosition = `-${ix}px -${iy}px`;
      });
    }, FRAME_TIME * Frame(6));

    return () => {
      clearInterval(renderInterval);
      clearInterval(animateInterval);
    };
  }, []);

  return (
    <div className="food-area">
      {foods !== undefined ? (
        foods.map((v, i) => {
          if (sizeIndex.current === null) return;
          return (
            <div
              className={`food ${v.data.foodType}`}
              ref={v.mainRef}
              key={v.id}
              style={{
                top: `${v.data.position.Y * TILE_SIZE[sizeIndex.current]}px`,
                left: `${v.data.position.X * TILE_SIZE[sizeIndex.current]}px`,
              }}
            ></div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
