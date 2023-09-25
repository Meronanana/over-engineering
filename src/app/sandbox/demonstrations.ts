/* eslint-disable react-hooks/rules-of-hooks */
import { MutableRefObject, RefObject } from "react";
import { sleep } from "../../utils/hooks";
import { Toy, ToyPhysics } from "./model/types";
import { Coordinate } from "@/utils/physicalEngine";
import { SPIN_SPEED_OFFSET, TUTORIAL_INDEX } from "./model/constants";

export const SandboxTutorial = async (
  toys: Array<Toy>,
  toyPhysicsList: MutableRefObject<Array<ToyPhysics>>,
  bgShadowRef: RefObject<HTMLDivElement>,
  tutorialMessageRef: RefObject<HTMLDivElement>,
  dockerRef: RefObject<HTMLDivElement>,
  toyGravityDrop: Function,
  spread: Function,
  dockerCoor: Coordinate
) => {
  const toyMoveRef = toys[TUTORIAL_INDEX].moveRef;
  const toyRotateRef = toys[TUTORIAL_INDEX].rotateRef;
  const toyPhysics = toyPhysicsList.current[TUTORIAL_INDEX];

  if (
    toyMoveRef.current === null ||
    toyRotateRef.current === null ||
    bgShadowRef.current === null ||
    tutorialMessageRef.current === null ||
    dockerRef.current === null
  ) {
    return;
  }

  tutorialMessageRef.current.innerHTML = "TUTORIAL";
  bgShadowRef.current.className = "sandbox-shadow";
  toyMoveRef.current.style.visibility = "visible";
  toyPhysics.FIXED = false;

  spread(TUTORIAL_INDEX, false);

  await sleep(1500);

  tutorialMessageRef.current.innerHTML = "HOLD";

  await sleep(1500);

  tutorialMessageRef.current.innerHTML = "THROW";
  toyPhysics.V = { vx: Math.floor(Math.random() * 40) - 20, vy: -30 };
  toyPhysics.dR = toyPhysics.V.vx * SPIN_SPEED_OFFSET;
  toyGravityDrop(TUTORIAL_INDEX);

  await sleep(2000);

  tutorialMessageRef.current.innerHTML = "TRY IT";
  toyPhysics.DST = dockerCoor;
  toyPhysics.R = 121;

  dockerRef.current.className = "sandbox-docker tutorial";

  await sleep(3500);

  spread(TUTORIAL_INDEX, true);

  await sleep(200);

  toyMoveRef.current.style.visibility = "hidden";
  bgShadowRef.current.className = "";
  dockerRef.current.className = "sandbox-docker";
  toyPhysics.FIXED = true;
};
