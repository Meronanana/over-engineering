export interface Vector {
  vx: number;
  vy: number;
}

export interface Coordinate {
  X: number;
  Y: number;
}

export interface Circle {
  x: number;
  y: number;
  d: number;
}

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

export const reactionByCircleCollision = (data: Array<Circle | null>, index: number, vector: Vector): Vector | null => {
  const point = data[index] as Circle;

  let result: Vector | null = null;
  data.forEach((v, i) => {
    if (result !== null || v === null || i === index) return;

    const dx = point.x - v.x;
    const dy = point.y - v.y;
    const threshold = point.d / 2 + v.d / 2;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) return;

    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (distance < threshold) {
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
