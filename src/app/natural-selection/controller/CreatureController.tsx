"use client";

import { RefObject, useRef } from "react";
import { CreatureRef } from "../model/render";
import CreatureView from "../view/CreatureView";

// import "./natsel.scss";

interface Props {
  creatureRefs: RefObject<CreatureRef[]>;
}

export default function CreatureController({ creatureRefs }: Props) {
  return (
    <>
      <CreatureView creatureRefs={creatureRefs} />
    </>
  );
}
