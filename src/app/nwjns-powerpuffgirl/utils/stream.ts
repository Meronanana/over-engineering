import { Coordinate, getBezierArray } from "@/utils/physicalEngine";

export function* hoveringSequence(index: number): Generator<number> {
  const seq: Array<number> = [-1]; // 0 > -5 > 5 > 0
  for (let i = 1; i < 5; i++) {
    seq.push(seq[seq.length - 1] - 1);
    seq.push(seq[seq.length - 1]);
  }
  for (let i = 0; i < 2; i++) {
    seq.push(seq[seq.length - 1]);
  }
  for (let i = 0; i < 10; i++) {
    seq.push(seq[seq.length - 1] + 1);
    seq.push(seq[seq.length - 1]);
  }
  for (let i = 0; i < 2; i++) {
    seq.push(seq[seq.length - 1]);
  }
  for (let i = 0; i < 5; i++) {
    seq.push(seq[seq.length - 1] - 1);
    seq.push(seq[seq.length - 1]);
  }

  if (1 <= index && index <= 3) {
    for (let i = 0; i < 22; i++) {
      yield 0;
    }
  }

  while (true) {
    for (let v of seq) {
      yield v;
    }
  }
}

export function* moveSequence(start: Coordinate, end: Coordinate, frames: number): Generator<Coordinate> {
  const moveX = end.X - start.X;
  const moveY = end.Y - start.Y;
  const xRoute = getBezierArray(frames).map((v) => v * moveX + start.X);
  const yRoute = getBezierArray(frames).map((v) => v * moveY + start.Y);

  for (let i = 0; i < frames - 1; i++) {
    yield { X: xRoute[i], Y: yRoute[i] } as Coordinate;
  }
  return { X: xRoute[frames - 1], Y: yRoute[frames - 1] } as Coordinate;
}
