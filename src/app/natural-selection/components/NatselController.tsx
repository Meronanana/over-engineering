import "./natselController.scss";

import { RefObject, useEffect, useRef } from "react";
import Link from "next/link";

import { useDispatch } from "react-redux";

import IconLog from "/public/assets/icons/Icon-Log.svg";

import { modalSwitch, setChild } from "@/utils/redux/modalState";

import { sleep } from "@/utils/utilFunctions";
import NatselDescription from "./NatselDescription";

interface Props {}

export default function NatselController({}: Props) {
  const dispatch = useDispatch();

  const titleRef: RefObject<HTMLAnchorElement> = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const titleChangeId = setInterval(titleChange, 10000);

    return () => {
      clearInterval(titleChangeId);
    };
  }, []);

  const titleChange = async () => {
    if (!titleRef.current) return;

    let str = "";
    if (titleRef.current.text === "over-engineering") str = "natural-selection";
    else if (titleRef.current.text === "natural-selection") str = "over-engineering";

    titleRef.current.style.transition = "0.5s";
    titleRef.current.style.opacity = "0";
    await sleep(500);
    titleRef.current.textContent = str;
    titleRef.current.style.opacity = "1";
  };

  const setDiscriptionModal = () => {
    dispatch(setChild((<NatselDescription />) as JSX.Element));
    dispatch(modalSwitch());
  };

  return (
    <div className="natsel-controller">
      <Link href="/" className="natsel-title" ref={titleRef}>
        over-engineering
      </Link>
      <Link href="https://github.com/Meronanana/over-engineering" legacyBehavior>
        <a className="natsel-tail" target="_blank">
          Workout by Jaeseong Jeong, 2023
        </a>
      </Link>
      <div className="master-docker">
        <IconLog className="docker-button" onClick={setDiscriptionModal} color="white" />
      </div>
    </div>
  );
}
