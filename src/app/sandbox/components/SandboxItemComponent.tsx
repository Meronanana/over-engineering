"use client";

import { MouseEventHandler, TouchEventHandler, useEffect } from "react";
import Image from "next/image";
import { SandboxItem, Toy } from "../model/types";
import { TOY_SIZES, WINDOW_SIZE_INDEXS } from "../model/constants";

import "./components.scss";

interface Props {
  itemData: SandboxItem;
}

export default function SandboxItemComponent({ itemData }: Props) {
  // useEffect(() => {
  //   resizeToy();
  //   window.addEventListener("resize", resizeToy);

  //   return () => {
  //     window.removeEventListener("resize", resizeToy);
  //   };
  // }, []);

  // const resizeToy = () => {
  //   const toyMoveRef = toyData.moveRef;

  //   if (toyMoveRef.current === null) return;

  //   const sizeIndex: number = window.innerWidth + window.innerHeight;

  //   for (let i = WINDOW_SIZE_INDEXS.length - 1; i >= 0; i--) {
  //     if (WINDOW_SIZE_INDEXS[i] <= sizeIndex) {
  //       toyMoveRef.current.style.width = TOY_SIZES[i] + "px";
  //       toyMoveRef.current.style.height = TOY_SIZES[i] + "px";

  //       break;
  //     }
  //   }
  // };

  return (
    <div className="item-div" ref={itemData.ref}>
      <itemData.image />
    </div>
  );
}
