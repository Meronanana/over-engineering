import { Key, LegacyRef, MutableRefObject, RefObject, useRef, useState } from "react";
import { Toy } from "../model/toy";
import "../sandbox.scss";
import { MouseEventHandler } from "react";
import { lerp } from "@/utils/physicalEngine";

interface Props {
  key: Key;
  metadata: Toy;
  toyRef: RefObject<HTMLDivElement>;
  mouseDownEvent: MouseEventHandler;
}

export default function ToyComponent({ key, metadata, toyRef, mouseDownEvent }: Props) {
  console.log(key);
  return (
    <div className="toy-div" key={key} ref={toyRef} onMouseDown={mouseDownEvent}>
      .
    </div>
  );
}
