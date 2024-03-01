import { CarType } from "@/app/deadlock/model/types";

export type Vector = {
  vx: number;
  vy: number;
};

export type ScreenCoordinate = {
  X: number;
  Y: number;
};

export type Circle = {
  x: number;
  y: number;
  d: number;
};

export type CarBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  type: CarType;
  index: number;
};

export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

export const getRadian = (vector: Vector): number => {
  let result = Math.atan2(-vector.vy, vector.vx);
  if (result < 0) result += Math.PI * 2;
  return result;
};

export const randomCoordinate = (maxWidth: number, maxHeight: number) => {
  return {
    X: Math.round(maxWidth * (Math.random() * 0.8 + 0.1)),
    Y: Math.round(maxHeight * (Math.random() * 0.8 + 0.1)),
  };
};

// 원형 오브젝트간 충돌 감지하여 이동 방향 반환
export const reactionByCircleCollision = (data: Array<Circle | null>, index: number, vector: Vector): Vector | null => {
  const point = data[index] as Circle;

  let result: Vector | null = null;
  data.forEach((v, i) => {
    if (result !== null || v === null || i === index) return;

    const dx = point.x - v.x;
    const dy = point.y - v.y;
    const threshold = point.d / 2 + v.d / 2;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) return;

    const distance = Math.pow(dx, 2) + Math.pow(dy, 2);
    if (distance < Math.pow(threshold, 2)) {
      const normal = getRadian({ vx: dx, vy: dy });
      const incoming = getRadian(vector);
      if (Math.abs(normal - incoming) < Math.PI / 2) return;

      const direction = normal * 2 - incoming + Math.PI;
      let speed = Math.sqrt(Math.pow(vector.vx, 2) + Math.pow(vector.vy, 2)) / 2;
      speed = speed > 3 ? speed : 3;
      result = { vx: Math.floor(speed * Math.cos(direction)), vy: Math.floor(-speed * Math.sin(direction)) };
    }
  });

  return result;
};

// Deadlock에서 바로 앞의 물체 여부 감지
export const isObjectInFront = (data: Array<CarBox | null>, index: number): boolean => {
  const thisBox = data[index];
  if (thisBox === null) return false;

  let coords: ScreenCoordinate[] = [];
  let gapRatio = 4 / 5;
  if (thisBox.type === CarType.FromLeft) {
    coords.push({ X: thisBox.x + thisBox.w / 4, Y: thisBox.y }); // 겹침 판정
    coords.push({ X: thisBox.x + thisBox.w * gapRatio, Y: thisBox.y }); // 바로 앞

    coords.push({ X: thisBox.x + thisBox.w * gapRatio, Y: thisBox.y - thisBox.h / 2 }); // 왼쪽 판정
    coords.push({ X: thisBox.x + thisBox.w * gapRatio, Y: thisBox.y + thisBox.h / 2 }); // 오른쪽 판정
  } else if (thisBox.type === CarType.FromBottom) {
    coords.push({ X: thisBox.x, Y: thisBox.y - thisBox.h / 4 });
    coords.push({ X: thisBox.x, Y: thisBox.y - thisBox.h * gapRatio });

    coords.push({ X: thisBox.x - thisBox.w / 2, Y: thisBox.y - thisBox.h * gapRatio });
    coords.push({ X: thisBox.x + thisBox.w / 2, Y: thisBox.y - thisBox.h * gapRatio });
  } else if (thisBox.type === CarType.FromRight) {
    coords.push({ X: thisBox.x - thisBox.w / 4, Y: thisBox.y });
    coords.push({ X: thisBox.x - thisBox.w * gapRatio, Y: thisBox.y });

    coords.push({ X: thisBox.x - thisBox.w * gapRatio, Y: thisBox.y + thisBox.h / 2 });
    coords.push({ X: thisBox.x - thisBox.w * gapRatio, Y: thisBox.y - thisBox.h / 2 });
  } else if (thisBox.type === CarType.FromTop) {
    coords.push({ X: thisBox.x, Y: thisBox.y + thisBox.h / 4 });
    coords.push({ X: thisBox.x, Y: thisBox.y + thisBox.h * gapRatio });

    coords.push({ X: thisBox.x + thisBox.w / 2, Y: thisBox.y + thisBox.h * gapRatio });
    coords.push({ X: thisBox.x - thisBox.w / 2, Y: thisBox.y + thisBox.h * gapRatio });
  }

  for (let i = 0; i < data.length; i++) {
    const tmp = data[i];
    if (tmp !== null && index !== i) {
      for (let j = 0; j < coords.length; j++) {
        let stdTop = coords[j].Y;
        let stdLeft = coords[j].X;

        if (
          stdTop >= tmp.y - tmp.h / 2 &&
          stdTop <= tmp.y + tmp.h / 2 &&
          stdLeft >= tmp.x - tmp.w / 2 &&
          stdLeft <= tmp.x + tmp.w / 2
        ) {
          if (j === 0 && i > index) continue;
          return true;
        }
      }
    }
  }

  return false;
};

// 2차원 정사각형에서 생성한 베지어 곡선의 y좌표값으로 1차원 수열 생성
export const getBezierArray = (n: number): Array<number> => {
  const result: Array<number> = [];

  const delay = 5;
  n -= delay * 2;

  for (let i = 0; i < delay; i++) {
    result.push(0);
  }
  for (let i = 1; i <= n; i++) {
    const t = i / n;

    result.push(t * t * (3 - 2 * t));
  }
  for (let i = 0; i < delay; i++) {
    result.push(1);
  }

  return result;
};
