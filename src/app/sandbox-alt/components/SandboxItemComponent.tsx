"use client";

import { MouseEventHandler, TouchEventHandler, useEffect } from "react";
import Image from "next/image";
import { SandboxItem, Toy } from "../model/types";
import { TOY_SIZES, WINDOW_WIDTH_INDEXS } from "../model/constants";

import "./components.scss";

interface Props {
  itemData: SandboxItem;
}

export default function SandboxItemComponent({ itemData }: Props) {
  return (
    <div className="item-div" ref={itemData.ref}>
      <itemData.image />
    </div>
  );
}
