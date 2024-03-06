import React from "react";

import "./layout.scss";

interface Props {
  children: React.ReactNode;
}

const ShowcaseLayout = ({ children }: Props) => {
  return <div className="layout-container">{children}</div>;
};

export default ShowcaseLayout;
