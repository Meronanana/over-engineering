import { Key, LegacyRef, MutableRefObject, RefObject, useRef, useState } from "react";
import Image from "next/image";
import { Toy } from "../model/types";
import { MouseEventHandler } from "react";
import "../sandbox.scss";

interface Props {
  idx: number;
  toyData: Toy;
  mouseDownEvent: MouseEventHandler;
}

export default function ToyComponent({ idx, toyData, mouseDownEvent }: Props) {
  return (
    <div className="toy-div" id={`${idx}toy`} ref={toyData.moveRef} onMouseDown={mouseDownEvent}>
      <div id={`${idx}toy`} ref={toyData.rotateRef}>
        {typeof toyData.image === "function" ? (
          <toyData.image className="toy-image" />
        ) : typeof toyData.image === "object" ? (
          <Image className="toy-image" src={toyData.image} alt={""} />
        ) : (
          <div className="toy-image">A</div>
        )}
      </div>
      {/* {idx === TUTORIAL_INDEX ? (
        <div className="toy-tutorial-message" ref={tutorialMessageRef}>
          AAAA
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
}
