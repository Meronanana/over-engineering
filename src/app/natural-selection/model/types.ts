export type Status = {
  speed: number;
  size: number;
  sense: number;
};

export type MapPosition = {
  X: number;
  Y: number;
};

// Frame은 양의 정수
export type Frame = number extends `-${number}` ? never : number extends `${number}.${number}` ? never : number;
export const Frame = (frame: number): Frame => {
  try {
    if (frame < 0) throw new Error("Frame is not positive");
    if (frame !== Math.floor(frame)) throw new Error("Frame is not integer");
  } catch (err) {
    console.error(err);
  }
  return frame;
};

// Turn은 양의 정수
export type Turn = number extends `-${number}` ? never : number extends `${number}.${number}` ? never : number;
export const Turn = (turn: number): Frame => {
  try {
    if (turn < 0) throw new Error("Turn is not positive");
    if (turn !== Math.floor(turn)) throw new Error("Turn is not integer");
  } catch (err) {
    console.error(err);
  }
  return turn;
};
