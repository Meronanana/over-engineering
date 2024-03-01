"use client";

import "./natselController.scss";

import { CSSProperties } from "react";

interface Props {
  big?: boolean;
}

export default function NatselDescription() {
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
    <div className="natsel-description">
      <h1>natural-selection</h1>
      <Spliter />
      <h3>{`
      물고기는 지느러미를 가지고 있습니다. 새는 날개를 가지고 있습니다. 
      우리는 이를 자연스럽게 받아들이고 있습니다. 자연스럽다는 것이 무엇일까요? 
      단지 우연히 그런 상태임을 의미할까요? 새가 날개를 가지게 된 데에는 나름의 이유가 있을 것입니다. 
      사람이 두 발로 걷는 이유는 두 손을 자유롭게 쓰기 위함입니다. 
      모든 생물과 사물의 생김새는 그렇게 된 까닭이 있습니다. 
      이는 단 번에 정해진 것도 아니고, 점진적으로 그렇게 변화했습니다. 이것이 자연 선택(natural-selection)의 개념입니다. 
      `}</h3>
      <h3>{`
      인터랙션 'natural-selection'은 자연 선택 시뮬레이션을 구현한 작품입니다. 
      귀여운 포켓몬들은 먹이를 찾아 떠납니다. 이들은 속도, 크기, 감지의 세 능력치를 가지고 있습니다. 
      속도가 빠르면 다른 포켓몬 보다 빠르게 이동합니다. 크기가 크면 다른 포켓몬을 위협하고, 잡아 먹을 수 있습니다. 
      감지가 좋으면 더 멀리 있는 식량원이나 포식자를 감지합니다. 
      충분히 많은 식량을 섭취한 포켓몬은 복제합니다. 이때 자식은 부모의 능력치에 기반한 랜덤한 능력치를 가지게 됩니다. 
      더 높은 능력치를 가지는 포켓몬은, 필요한 식량이 늘어납니다. 
      어떤 포켓몬이 오래 살아남을까요? 천천히 변화를 감상하세요.
      `}</h3>
      <Spliter big />
      <h2>Contributer: Jaeseong Jeong</h2>
      <h2>Reference: Pokemon, Stardew Valley</h2>
    </div>
  );
}
