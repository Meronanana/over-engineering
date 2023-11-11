"use client";

import { RefObject, useRef } from "react";
import { FoodRef } from "../model/render";
import FoodView from "../view/FoodView";

// import "./natsel.scss";

interface Props {
  foodRefs: RefObject<FoodRef[]>;
}

export default function FoodController({ foodRefs }: Props) {
  return (
    <>
      <FoodView foodRefs={foodRefs} />
    </>
  );
}
