"use client";

import { CSSProperties } from "react";
import "./components.scss";

interface Props {
  big?: boolean;
}

export default function DeadlockDescription() {
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
    <div className="deadlock-description">
      <h1>deadlock</h1>
      <Spliter />
      <h3>{`
      네 방향에서 자동차가 다가옵니다. 네 자동차는 교차로에서 만납니다. 
      모든 차는 오른편에서 오는 차가 가로막기 때문에 앞으로 갈 수 없습니다. 컴퓨터에서도 이와 비슷한 일이 일어납니다. 
      공유 자원을 서로 다른 프로세스가 나누어 점유하여 어느 프로세스도 정상적으로 작업을 마칠 수 없게 될 수 있습니다. 
      이를 'deadlock'이라고 합니다. 그래서 컴퓨터에서는 이를 방지하기 위한 알고리즘을 마련해 두었습니다. 이를 'semaphore'라고 하며 신호등 역할을 합니다.
      `}</h3>
      <h3>{`
      인터랙션 'deadlock'은 컴퓨터에서의 deadlock 현상을 비유적으로 표현합니다. 
      자동차의 움직임은 작업을 수행하는 프로세스를 의미합니다. 교차로는 공유 자원을 의미합니다. 
      신호등은 semaphore 알고리즘을 표현합니다. 자동차는 직접 끌어서 움직일 수 있습니다. 
      이를 통해 사용자는 수동으로 deadlock을 방지할 수 있습니다. 이를 자동으로 수행하고 싶다면, 신호등을 켤 수 있습니다.
      `}</h3>
      <Spliter big />
      <h2>Contributer: Jaeseong Jeong</h2>
      <h2>Reference: Mini Motorways</h2>
    </div>
  );
}
