import { RefObject } from "react";

export enum CarType {
  FromLeft = 0,
  FromBottom = 1,
  FromRight = 2,
  FromTop = 3,
}

export type CarItem = {
  type: CarType;
  ref: RefObject<HTMLDivElement>;
};
