import { RefObject } from "react";

export interface Toy {
  moveRef: RefObject<HTMLDivElement>;
  rotateRef: RefObject<HTMLDivElement>;
  name: string;
  link: string;
  image: any;
}
