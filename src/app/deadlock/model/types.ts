import { RefObject } from "react";

export enum CarType {
  FromLeft = 0,
  FromBottom = 1,
  FromRight = 2,
  FromTop = 3,
}

export type Lane = {
  TL: boolean;
  ref: RefObject<HTMLDivElement>;
};

export type Lanes = {
  fromLeft: Lane;
  fromBottom: Lane;
  fromRight: Lane;
  fromTop: Lane;
};

export type FourDirectionRefs = {
  fromLeft: RefObject<HTMLDivElement>;
  fromBottom: RefObject<HTMLDivElement>;
  fromRight: RefObject<HTMLDivElement>;
  fromTop: RefObject<HTMLDivElement>;
};

export type CarItem = {
  type: CarType;
  carRef: RefObject<HTMLDivElement>;
  imgRef: RefObject<HTMLDivElement>;
  shadowRef: RefObject<HTMLDivElement>;
  key: number;
};
