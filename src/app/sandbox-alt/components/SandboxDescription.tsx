"use client";

import { CSSProperties } from "react";
import "./components.scss";

interface Props {
  big?: boolean;
}

export default function SandboxDescription() {
  const Spliter = ({ big }: Props): JSX.Element => {
    const style: CSSProperties = big
      ? {
          height: "2px",
          backgroundColor: "white",
          marginTop: "20px",
          marginBottom: "20px",
        }
      : {
          height: "1px",
          backgroundColor: "white",
          marginTop: "5px",
          marginBottom: "5px",
        };
    return <div style={style} />;
  };

  return (
    <div className="sandbox-description">
      <h1>over-engineering</h1>
      <Spliter />
      <h3>{`
      \0\0엔지니어가 되는 이유는 무엇인가요? 엔지니어는 작품이 올바르게 동작할 수 있도록 합니다. 
      상상을 현실로 만듭니다. '상상을 현실로' 그 자체가 엔지니어가 되려는 이유일 것입니다. 
      엔지니어는 아름다운 외관, 치밀한 구조를 꿈꿉니다. 하지만 속세는 적절한 외관, 적절한 기능, 극대화된 수익성을 갖춘 제품을 만들라고 합니다. 
      이 기준을 넘어서면 너무 많이 일했다고 합니다. 이것을 우리는 'over-engineering' 이라고 합니다.
      `}</h3>
      <h3>{`
      \0\0'over-engineering'은 UX Project입니다. 다양한 오브젝트와 이들간의 Interaction을 통해 사용자에게 영감을 받는 순간을 주고자 합니다. 
      over-engineering은 여러 작품이 모여 구성됩니다. 작품은 하나의 주제를 다룬 이야기입니다. 다양한 작품을 감상하세요. 
      각 작품에서 웹 기술을 활용한 창의적인 Interaction을 경험하세요. 작품을 보이는 그대로 느끼고, 의미를 생각해보세요.
      `}</h3>
      <h3>{`over-engineering은 엔지니어와 디자이너를 찾고 있습니다. 참여하고싶다면, 다음 연락처로 문의주세요.`}</h3>
      <h3>{`gik1819@naver.com`}</h3>
      <Spliter big />
      <h1>Sandbox</h1>
      <Spliter />
      <h2>Engineer: Jaeseong Jeong</h2>
      <h2>Designer: Jaeseong Jeong</h2>
      <Spliter />
      <h3>{`'Sandbox'는 여러분을 가장 먼저 맞이하는 작품입니다.`}</h3>
      <Spliter big />
      <h2>Owner: Jaeseong Jeong</h2>
      <h2>Contributer: not yet</h2>
    </div>
  );
}
