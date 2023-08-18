export const lerp = (start: number, end: number, t: number = 0.1) => {
  return start * (1 - t) + end * t;
};
