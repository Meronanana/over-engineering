import { RefObject, createRef } from "react";
import { Coordinate, Vector } from "@/utils/physicalEngine";
import { StaticImageData } from "next/image";

import ToyTutoMouse from "/public/assets/icons/toy-tuto-mouse.svg";
import ToyLinkQR from "/public/assets/icons/toy-link-qr.png";
import ToyDeadlock from "/public/assets/icons/toy-deadlock.svg";
import { charaSelector } from "@/utils/nwjnsCharacter";
import {
  SandArticle1,
  SandArticle2,
  SandArticle3,
  SandArticle4,
  SandArticle5,
  Shell1,
  Shell2,
  Starfish1,
  Starfish2,
  Starfish3,
  TreeLeaves,
  TreePole,
  TreeShadow,
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
  sandLayerRef: RefObject<HTMLDivElement>;
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
  width: number;
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
    sandLayerRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyLinkQR,
  },
  {
    name: "deadlock",
    moveRef: createRef(),
    rotateRef: createRef(),
    sandLayerRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyDeadlock,
  },
  {
    name: "nwjns-powerpuffgirl",
    moveRef: createRef(),
    rotateRef: createRef(),
    sandLayerRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: charaSelector(),
  },
  {
    name: "tutorial",
    moveRef: createRef(),
    rotateRef: createRef(),
    sandLayerRef: createRef(),
    physics: { ...defaultToyPhysics },
    link: "",
    image: ToyTutoMouse,
  },
];

export const defaultItemList: Array<SandboxItem> = [
  {
    position: { X: 2288, Y: 1342 },
    width: 115,
    height: 125,
    ref: createRef(),
    image: SandArticle1,
  },
  {
    position: { X: 3658, Y: 384 },
    width: 115,
    height: 125,
    ref: createRef(),
    image: SandArticle2,
  },
  {
    position: { X: 3546, Y: 1689 },
    width: 115,
    height: 125,
    ref: createRef(),
    image: SandArticle3,
  },
  {
    position: { X: 1500, Y: 967 },
    width: 115,
    height: 125,
    ref: createRef(),
    image: SandArticle4,
  },
  {
    position: { X: 428, Y: 1630 },
    width: 115,
    height: 125,
    ref: createRef(),
    image: SandArticle5,
  },
  {
    position: { X: 500, Y: 1780 },
    width: 184,
    height: 169,
    ref: createRef(),
    image: Shell1,
  },
  {
    position: { X: 2634, Y: 900 },
    width: 184,
    height: 169,
    ref: createRef(),
    image: Shell2,
  },

  {
    position: { X: 3320, Y: 1638 },
    width: 180,
    height: 184,
    ref: createRef(),
    image: Starfish1,
  },
  {
    position: { X: 1436, Y: 1524 },
    width: 180,
    height: 184,
    ref: createRef(),
    image: Starfish2,
  },
  {
    position: { X: 460, Y: 723 },
    width: 180,
    height: 184,
    ref: createRef(),
    image: Starfish3,
  },
];

export const treePoleItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: 148,
  height: 800,
  ref: createRef(),
  image: TreePole,
};

export const treeLeavesItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: 1032,
  height: 548,
  ref: createRef(),
  image: TreeLeaves,
};

export const treeShadowItem: SandboxItem = {
  position: { X: -1, Y: -1 },
  width: 1203,
  height: 1462,
  ref: createRef(),
  image: TreeShadow,
};
