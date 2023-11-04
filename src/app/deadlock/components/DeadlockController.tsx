import { RefObject, useEffect, useRef } from "react";
import Link from "next/link";

import { useDispatch } from "react-redux";
import DeadlockDescription from "./DeadlockDescription";

import IconLog from "/public/assets/icons/Icon-Log.svg";

import { modalSwitch, setChild } from "@/utils/redux/modalState";

import "./components.scss";
import { sleep } from "@/utils/utilFunctions";

interface Props {}

export default function DeadlockController({}: Props) {
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
    if (titleRef.current.text === "over-engineering") str = "deadlock";
    else if (titleRef.current.text === "deadlock") str = "over-engineering";

    titleRef.current.style.transition = "0.5s";
    titleRef.current.style.opacity = "0";
    await sleep(500);
    titleRef.current.textContent = str;
    titleRef.current.style.opacity = "1";
  };

  const setDiscriptionModal = () => {
    dispatch(setChild((<DeadlockDescription />) as JSX.Element));
    dispatch(modalSwitch());
  };

  return (
    <div className="deadlock-controller">
      <Link href="/" className="deadlock-title" ref={titleRef}>
        over-engineering
      </Link>
      <Link href="https://github.com/Meronanana/over-engineering" legacyBehavior>
        <a className="deadlock-tail" target="_blank">
          Workout by Jaeseong Jeong, 2023
        </a>
      </Link>
      <div className="master-docker">
        <IconLog className="docker-button" onClick={setDiscriptionModal} color="gray" />
      </div>
    </div>
  );
}
