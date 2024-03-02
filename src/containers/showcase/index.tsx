import React from "react";

import "./index.scss";

interface Props {
  name: string;
}

const Showcase: React.FC<Props> = ({ name }) => {
  return <h1>{`${name}`}</h1>;
};

export default Showcase;
