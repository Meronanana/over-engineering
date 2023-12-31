"use client";

import { MouseEventHandler, TouchEventHandler, useEffect } from "react";
import Image from "next/image";
import { Toy } from "../model/types";
import { TOY_SIZES, WINDOW_WIDTH_INDEXS } from "../model/constants";

import "./components.scss";

interface Props {
  idx: number;
  toyData: Toy;
  mouseDownEvent: MouseEventHandler;
  touchStartEvent: TouchEventHandler;
}

export default function ToyComponent({ idx, toyData, mouseDownEvent, touchStartEvent }: Props) {
  useEffect(() => {
    resizeToy();
    window.addEventListener("resize", resizeToy);

    return () => {
      window.removeEventListener("resize", resizeToy);
    };
  }, []);

  const resizeToy = () => {
    const toyMoveRef = toyData.moveRef;

    if (toyMoveRef.current === null) return;

    const sizeIndex: number = window.innerWidth;

    for (let i = WINDOW_WIDTH_INDEXS.length - 1; i >= 0; i--) {
      if (WINDOW_WIDTH_INDEXS[i] <= sizeIndex) {
        toyMoveRef.current.style.width = TOY_SIZES[i] + "px";
        toyMoveRef.current.style.height = TOY_SIZES[i] + "px";

        break;
      }
    }
  };

  return (
    <div
      className="toy-div"
      id={`${idx}toy`}
      ref={toyData.moveRef}
      onMouseDown={mouseDownEvent}
      onTouchStart={touchStartEvent}
    >
      <div className="toy-image" id={`${idx}toy`} ref={toyData.rotateRef}>
        {typeof toyData.image === "function" ? (
          <toyData.image />
        ) : typeof toyData.image === "object" ? (
          <Image src={toyData.image} alt={""} />
        ) : (
          <div>A</div>
        )}
      </div>
    </div>
  );
}
