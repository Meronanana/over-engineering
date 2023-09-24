export type Vector = {
  vx: number;
  vy: number;
};

export type Coordinate = {
  X: number;
  Y: number;
};

export type Circle = {
  x: number;
  y: number;
  d: number;
};

export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

export const getRadius = (vector: Vector): number => {
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
      const normal = getRadius({ vx: dx, vy: dy });
      const incoming = getRadius(vector);
      if (Math.abs(normal - incoming) < Math.PI / 2) return;

      const direction = normal * 2 - incoming + Math.PI;
      let speed = Math.sqrt(Math.pow(vector.vx, 2) + Math.pow(vector.vy, 2)) / 2;
      speed = speed > 3 ? speed : 3;
      result = { vx: Math.floor(speed * Math.cos(direction)), vy: Math.floor(-speed * Math.sin(direction)) };
    }
  });

  return result;
};

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
