import { LegacyRef, MutableRefObject, RefObject, useRef, useState } from "react";
import "../sandbox.scss";
import { MouseEventHandler } from "react";
import { lerp } from "@/utils/mathEngine";

interface Props {
  toyRef: RefObject<HTMLDivElement>;
  mouseDownRef: MutableRefObject<boolean>;
}

export default function Toy({ toyRef, mouseDownRef }: Props) {
  const mouseDownEvent: MouseEventHandler = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) mouseDownRef.current = true;
  };

  return (
    <div className="toy-div" ref={toyRef} onMouseDown={mouseDownEvent}>
      .
    </div>
  );
}
