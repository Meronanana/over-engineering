import { StaticImageData } from "next/image";

import HaerinFow1 from "/public/assets/images/nwjns/haerin-fow-1.png";
import HaerinFow2 from "/public/assets/images/nwjns/haerin-fow-2.png";
import HaerinFow3 from "/public/assets/images/nwjns/haerin-fow-3.png";
import HaerinRev1 from "/public/assets/images/nwjns/haerin-fow-1.png";
import HaerinRev2 from "/public/assets/images/nwjns/haerin-fow-2.png";
import HaerinRev3 from "/public/assets/images/nwjns/haerin-fow-3.png";

import DanielleFow1 from "/public/assets/images/nwjns/danielle-fow-1.png";
import DanielleFow2 from "/public/assets/images/nwjns/danielle-fow-2.png";
import DanielleFow3 from "/public/assets/images/nwjns/danielle-fow-3.png";
import DanielleRev1 from "/public/assets/images/nwjns/danielle-fow-1.png";
import DanielleRev2 from "/public/assets/images/nwjns/danielle-fow-2.png";
import DanielleRev3 from "/public/assets/images/nwjns/danielle-fow-3.png";

const characters = [HaerinFow1, DanielleFow1];

export const charaSelector = (): StaticImageData => {
  return characters[Math.floor(Math.random() * characters.length)];
};
