import React, { useEffect } from "react";
import "./Carousel.scss";

interface Props {
  carouselIndex: number;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Carousel: React.FC<Props> = ({ carouselIndex, setCarouselIndex }) => {
  const [carouselRotate, setCarouselRotate] = React.useState(0);

  console.log(carouselRotate);
  useEffect(() => {
    let element: HTMLDivElement | null = document.querySelector(
      ".carousel-container"
    );
    if (element !== null) {
      element.style.transform = `translate(-50%, -50%) rotate(${carouselRotate}deg)`;
    }
  }, [carouselRotate]);

  const eventA = (e: React.MouseEvent<HTMLDivElement>) => {
    setCarouselRotate((state) => state + 10);
  };
  return <div className="carousel-container" onMouseDown={eventA}></div>;
};

export default Carousel;
