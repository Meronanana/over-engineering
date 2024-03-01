"use client";

import { CSSProperties } from "react";
import Image, { StaticImageData } from "next/image";

import "./components.scss";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { modalClose } from "@/utils/redux/modalState";

interface Props {
  name: string;
  link: string;
  Img: StaticImageData | any;
}

interface SpliterProps {
  big?: boolean;
}

type ObjType = {
  [index: string]: string;
};

const descriptions: ObjType = {
  "qr-code": `큐알코드에영`,
  deadlock: `데드락락`,
  "nwjns-powerpuffgirl": `버거워요`,
  "natural-selection": `자연 선택 시뮬레이션`,
  tutorial: `없어짐`,
};

export default function ToyDescription({ name, link, Img }: Props) {
  const dispatch = useDispatch();

  const DescriptionImage = () => {
    return (
      <div className="toy-image">
        {typeof Img === "function" ? <Img /> : typeof Img === "object" ? <Image src={Img} alt={""} /> : <div>A</div>}
      </div>
    );
  };

  const Spliter = ({ big }: SpliterProps): JSX.Element => {
    const style: CSSProperties = big
      ? {
          width: "100%",
          height: "2px",
          backgroundColor: "black",
          marginTop: "20px",
          marginBottom: "20px",
        }
      : {
          width: "100%",
          height: "1px",
          backgroundColor: "black",
          marginTop: "5px",
          marginBottom: "5px",
        };
    return <div style={style} />;
  };

  return (
    <div className="toy-description">
      <DescriptionImage />
      <div className="description-text">
        <h1>{name}</h1>
        <h3>{descriptions[`${name}`]}</h3>
        <Spliter />
        <h2>
          {name === "qr-code" ? (
            `Take QR!`
          ) : (
            <Link href={link} onClick={() => dispatch(modalClose())}>
              {link !== "" ? "Visit" : "Preparing"}
            </Link>
          )}
        </h2>
      </div>
    </div>
  );
}
