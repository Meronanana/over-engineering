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
import { hoveringSequence } from "../utils/stream";

export type NWJNSCharacter = {
  name: string;
  ref: RefObject<HTMLDivElement>;
  hover: Generator;
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

export const defaultCharacters: Array<NWJNSCharacter> = [
  {
    name: "haerin",
    ref: createRef(),
    hover: hoveringSequence(),
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
    name: "danielle",
    ref: createRef(),
    hover: hoveringSequence(),
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
