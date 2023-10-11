import { RefObject, createRef } from "react";
import { Coordinate, Vector } from "@/utils/physicalEngine";
import { StaticImageData } from "next/image";

import ToyTutoMouse from "/public/assets/icons/toy-tuto-mouse.svg";
import ToyLinkQR from "/public/assets/icons/toy-link-qr.png";
import ToyDeadlock from "/public/assets/icons/toy-deadlock.svg";
import { charaSelector } from "@/utils/nwjnsCharacter";
import {
  Cloud1,
  Cloud2,
  Cloud3,
  SandBack,
  SandFront,
  TrayLeft,
  TrayRight,
  TraySmallLeft,
  TraySmallRight,
} from "./sandboxItems";

export enum SandboxAlignType {
  Grid = 0,
  Free = 1,
  Shake = 2,
}

export type Toy = {
  name: string;
  moveRef: RefObject<HTMLDivElement>;
  rotateRef: RefObject<HTMLDivElement>;
  physics: ToyPhysics;
  link: string;
  image: StaticImageData | any;
};

export type ToyPhysics = {
  X: Array<number>; // X값 변량 추적
  Y: Array<number>; // Y값 변량 추적
  DST: Coordinate; // 목적 좌표
  V: Vector; // 현재 이동 방향
  R: number; // 현재 회전각
  dR: number; // 현재 회전각속도
  FIXED: boolean; // 이동 가능 여부
};

export type SandboxItem = {
  position: Coordinate;
  width: number | Array<number>;
  height: number;
  ref: RefObject<HTMLDivElement>;
  image: any;
};

export const defaultToyPhysics: ToyPhysics = {
  X: [0],
  Y: [0],
  DST: { X: -1, Y: -1 } as Coordinate,
  V: { vx: 0, vy: 0 } as Vector,
  R: 0,
  dR: 0,
  FIXED: false,
};

export const defaultToyList: Array<Toy> = [
  {
    name: "qr-code",
    moveRef: createRef(),
    rotateRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyLinkQR,
  },
  {
    name: "deadlock",
    moveRef: createRef(),
    rotateRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyDeadlock,
  },
  {
    name: "nwjns-powerpuffgirl",
    moveRef: createRef(),
    rotateRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "nwjns-powerpuffgirl",
    image: charaSelector(),
  },
  {
    name: "tutorial",
    moveRef: createRef(),
    rotateRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyTutoMouse,
  },
];

export const cloudItemList: Array<SandboxItem> = [
  {
    position: { X: -1, Y: -1 },
    width: 3840,
    height: 600,
    ref: createRef(),
    image: Cloud1,
  },
  {
    position: { X: -1, Y: -1 },
    width: 3840,
    height: 600,
    ref: createRef(),
    image: Cloud2,
  },
  {
    position: { X: -1, Y: -1 },
    width: 3840,
    height: 600,
    ref: createRef(),
    image: Cloud3,
  },
];

export const trayLeftItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: [1500, 1000, 700],
  height: 300,
  ref: createRef(),
  image: TrayLeft,
};

export const trayRightItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: [1500, 1000, 700],
  height: 300,
  ref: createRef(),
  image: TrayRight,
};

export const sandFrontItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: 3000,
  height: 367,
  ref: createRef(),
  image: SandFront,
};

export const sandBackItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: 3000,
  height: 390,
  ref: createRef(),
  image: SandBack,
};
