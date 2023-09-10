import { useState, MouseEventHandler, MutableRefObject, RefObject } from "react";
import Link from "next/link";
import { SandboxAlignType, Toy } from "../model/types";

import IconShrink from "/public/assets/icons/Icon-Shrink.svg";
import IconGrid from "/public/assets/icons/Icon-Grid.svg";
import IconShake from "/public/assets/icons/Icon-Shake.svg";
import IconLog from "/public/assets/icons/Icon-Log.svg";

import "../sandbox.scss";

interface Props {
  alignRef: MutableRefObject<SandboxAlignType>;
  dockerRef: RefObject<HTMLDivElement>;
  backgroundShrinkRef: MutableRefObject<boolean>;
  backgroundInitialize: Function;
  alignModeChange: Function;
  logBtn: Function;
}

export default function SandboxController({
  alignRef,
  dockerRef,
  backgroundShrinkRef,
  backgroundInitialize,
  alignModeChange,
  logBtn,
}: Props) {
  const [align, setAlign] = useState(SandboxAlignType.Free);
  return (
    <div>
      <Link href="/" className={align === SandboxAlignType.Grid ? "sandbox-title on-grid" : "sandbox-title"}>
        over-engineering
      </Link>
      <div className="master-docker">
        {/* <IconTutorial
            className="docker-button"
            onClick={() => {
              if (screenRef.current === null) return;
              const coor =
                screenRef.current.offsetHeight < screenRef.current.offsetWidth
                  ? {
                      X: screenRef.current.offsetWidth - screenRef.current.offsetHeight * 0.15,
                      Y: screenRef.current.offsetHeight * 0.5,
                    }
                  : { X: screenRef.current.offsetWidth * 0.85, Y: screenRef.current.offsetHeight * 0.5 };
              SandboxTutorial(
                dummyToys,
                toyPhysicsList,
                bgShadowRef,
                tutorialMessageRef,
                dockerRef,
                toyGravityDrop,
                spread,
                coor
              );
            }}
            color={align === AlignType.Grid ? "white" : "gray"}
          /> */}
        <IconLog
          className="docker-button"
          onClick={logBtn}
          color={align === SandboxAlignType.Grid ? "white" : "gray"}
        />
      </div>
      <div className="sandbox-docker" ref={dockerRef}>
        <IconShrink
          className="docker-button"
          onClick={() => {
            backgroundShrinkRef.current = !backgroundShrinkRef.current;
            backgroundInitialize();
          }}
          color={
            backgroundShrinkRef.current === true ? "aquamarine" : align === SandboxAlignType.Grid ? "white" : "gray"
          }
        />
        <IconGrid
          className="docker-button"
          onClick={() => {
            alignModeChange(alignRef.current === SandboxAlignType.Grid ? SandboxAlignType.Free : SandboxAlignType.Grid);
            setAlign(alignRef.current);
          }}
          color={align === SandboxAlignType.Grid ? "aquamarine" : "gray"}
        />
        <IconShake
          className="docker-button"
          onClick={() => {
            alignModeChange(SandboxAlignType.Shake);
            setAlign(alignRef.current);
          }}
          color={align === SandboxAlignType.Grid ? "white" : "gray"}
        />
      </div>
    </div>
  );
}