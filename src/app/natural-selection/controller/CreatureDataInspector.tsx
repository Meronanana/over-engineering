"use client";

import { RefObject, useRef } from "react";
import { CreatureRef } from "../model/render";
import CreatureView from "../view/CreatureView";

import "./inspector.scss";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
}

export default function CreatureDataInspector({ creatureRefs }: Props) {
  return (
    <div className="data-inspector">
      <h3>가나다</h3>
    </div>
  );
}
