import { LegacyRef, MutableRefObject, RefObject, useRef, useState } from "react";
import "../sandbox.scss";
import { MouseEventHandler } from "react";
import { lerp } from "@/utils/physicalEngine";

interface Props {
  toyRef: RefObject<HTMLDivElement>;
  mouseDownEvent: MouseEventHandler;
}

export default function Toy({ toyRef, mouseDownEvent }: Props) {
  return (
    <div className="toy-div" ref={toyRef} onMouseDown={mouseDownEvent}>
      .
    </div>
  );
}
