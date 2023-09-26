import {
  DanielleFow1,
  DanielleFow2,
  DanielleFow3,
  DanielleRev1,
  DanielleRev2,
  DanielleRev3,
  HaerinFow1,
  HaerinFow2,
  HaerinFow3,
  HaerinRev1,
  HaerinRev2,
  HaerinRev3,
} from "@/utils/nwjnsCharacter";
import { StaticImageData } from "next/image";
import { RefObject, createRef } from "react";
import { Coordinate, Vector } from "@/utils/physicalEngine";
import { hoveringSequence } from "../utils/stream";
import { ScreenType } from "@/utils/types";

export type NWJNSCharacter = {
  name: string;
  ref: RefObject<HTMLDivElement>;
  physics: NWJNSPhysics;
  images: NWJNSImage;
};

export type NWJNSImage = {
  fow1: StaticImageData;
  fow2: StaticImageData;
  fow3: StaticImageData;
  rev1: StaticImageData;
  rev2: StaticImageData;
  rev3: StaticImageData;
};

export type NWJNSPhysics = {
  DST: Coordinate;
  HOVER: Vector;
  HOVER_SEQ: Generator<number>;
};

export type Offsets = {
  stageWidth: number;
  stageHeight: number;
  charaSize: number;
  screenType: ScreenType;
};

// export const haerinImages = {
//   fow1: HaerinFow1,
//   fow2: HaerinFow2,
//   fow3: HaerinFow3,
//   rev1: HaerinRev1,
//   rev2: HaerinRev2,
//   rev3: HaerinRev3,
// };

// export const danielleImages = {
//   fow1: DanielleFow1,
//   fow2: DanielleFow2,
//   fow3: DanielleFow3,
//   rev1: DanielleRev1,
//   rev2: DanielleRev2,
//   rev3: DanielleRev3,
// };

export const defaultCharacters: Array<NWJNSCharacter> = [
  {
    name: "minji",
    ref: createRef(),
    physics: {
      DST: { X: 0, Y: 0 } as Coordinate,
      HOVER: { vx: 0, vy: 0 } as Vector,
      HOVER_SEQ: hoveringSequence(0),
    },
    images: {
      fow1: DanielleFow1,
      fow2: DanielleFow2,
      fow3: DanielleFow3,
      rev1: DanielleRev1,
      rev2: DanielleRev2,
      rev3: DanielleRev3,
    },
  },
  {
    name: "hanni",
    ref: createRef(),
    physics: {
      DST: { X: 0, Y: 0 } as Coordinate,
      HOVER: { vx: 0, vy: 0 } as Vector,
      HOVER_SEQ: hoveringSequence(1),
    },
    images: {
      fow1: DanielleFow1,
      fow2: DanielleFow2,
      fow3: DanielleFow3,
      rev1: DanielleRev1,
      rev2: DanielleRev2,
      rev3: DanielleRev3,
    },
  },

  {
    name: "danielle",
    ref: createRef(),
    physics: {
      DST: { X: 0, Y: 0 } as Coordinate,
      HOVER: { vx: 0, vy: 0 } as Vector,
      HOVER_SEQ: hoveringSequence(2),
    },
    images: {
      fow1: DanielleFow1,
      fow2: DanielleFow2,
      fow3: DanielleFow3,
      rev1: DanielleRev1,
      rev2: DanielleRev2,
      rev3: DanielleRev3,
    },
  },
  {
    name: "haerin",
    ref: createRef(),
    physics: {
      DST: { X: 0, Y: 0 } as Coordinate,
      HOVER: { vx: 0, vy: 0 } as Vector,
      HOVER_SEQ: hoveringSequence(3),
    },
    images: {
      fow1: HaerinFow1,
      fow2: HaerinFow2,
      fow3: HaerinFow3,
      rev1: HaerinRev1,
      rev2: HaerinRev2,
      rev3: HaerinRev3,
    },
  },
  {
    name: "hyein",
    ref: createRef(),
    physics: {
      DST: { X: 0, Y: 0 } as Coordinate,
      HOVER: { vx: 0, vy: 0 } as Vector,
      HOVER_SEQ: hoveringSequence(4),
    },
    images: {
      fow1: DanielleFow1,
      fow2: DanielleFow2,
      fow3: DanielleFow3,
      rev1: DanielleRev1,
      rev2: DanielleRev2,
      rev3: DanielleRev3,
    },
  },
];
