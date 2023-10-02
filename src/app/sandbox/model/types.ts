import { Coordinate, Vector } from "@/utils/physicalEngine";
import { StaticImageData } from "next/image";
import { RefObject } from "react";

export enum SandboxAlignType {
  Grid = 0,
  Free = 1,
  Shake = 2,
}

export interface Toy {
  name: string;
  moveRef: RefObject<HTMLDivElement>;
  rotateRef: RefObject<HTMLDivElement>;
  physics: ToyPhysics;
  link: string;
  image: StaticImageData | any;
}

export interface ToyPhysics {
  X: Array<number>; // X값 변량 추적
  Y: Array<number>; // Y값 변량 추적
  DST: Coordinate; // 목적 좌표
  V: Vector; // 현재 이동 방향
  R: number; // 현재 회전각
  dR: number; // 현재 회전각속도
  FIXED: boolean; // 이동 가능 여부
}

export const defaultToyPhysics = {
  X: [0],
  Y: [0],
  DST: { X: -1, Y: -1 } as Coordinate,
  V: { vx: 0, vy: 0 } as Vector,
  R: 0,
  dR: 0,
  FIXED: false,
};
