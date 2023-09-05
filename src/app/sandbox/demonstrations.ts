/* eslint-disable react-hooks/rules-of-hooks */
import { MutableRefObject, RefObject } from "react";
import { useSleep } from "../../utils/hooks";
import { Toy } from "./model/toy";
import { Coordinate, ToyPhysics } from "@/utils/physicalEngine";
import { SPIN_SPEED_OFFSET } from "./model/constants";

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
  const tutorialIndex = 0;
  const toyMoveRef = toys[tutorialIndex].moveRef;
  const toyRotateRef = toys[tutorialIndex].rotateRef;
  const toyPhysics = toyPhysicsList.current[tutorialIndex];

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

  spread(tutorialIndex, false);

  await useSleep(1500);

  tutorialMessageRef.current.innerHTML = "HOLD";

  await useSleep(1500);

  tutorialMessageRef.current.innerHTML = "THROW";
  toyPhysics.V = { vx: Math.floor(Math.random() * 40) - 20, vy: -30 };
  toyPhysics.dR = toyPhysics.V.vx * SPIN_SPEED_OFFSET;
  toyGravityDrop(tutorialIndex);

  await useSleep(2000);

  tutorialMessageRef.current.innerHTML = "TRY IT";
  toyPhysics.DST = dockerCoor;
  toyPhysics.R = 121;

  dockerRef.current.className = "sandbox-docker tutorial";

  await useSleep(3500);

  spread(tutorialIndex, true);

  await useSleep(200);

  toyMoveRef.current.style.visibility = "hidden";
  bgShadowRef.current.className = "";
  dockerRef.current.className = "sandbox-docker";
};
