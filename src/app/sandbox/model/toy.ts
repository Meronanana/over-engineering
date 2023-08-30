import { RefObject } from "react";

export interface Toy {
  ref: RefObject<HTMLDivElement>;
  name: string;
  link: string;
  image: any;
}
