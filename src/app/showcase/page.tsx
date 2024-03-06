"use client";

import { useState } from "react";

import "./layout.scss";

const App: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="box-tmp" style={{ height: "200px" }}>
        <h1>{`Carousel`}</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="box-tmp">
          <h1>{`Left Description`}</h1>
        </div>
        <div className="box-tmp">
          <h1>{`Jacket`}</h1>
        </div>
        <div className="box-tmp">
          <h1>{`Right Description`}</h1>
        </div>
      </div>
    </div>
  );
};

export default App;
