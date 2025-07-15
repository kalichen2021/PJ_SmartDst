import type { Circle, Point, Polygon, Rect } from "./type";

//#region  Geometry
export const getD = (axis0: Point, axis1?: Point) => {
  if (!axis1) {
    axis1 = axis0.map((val) => 0) as Point;
  }
  return Math.sqrt(
    axis0.reduce((sum, val, i) => sum + Math.pow(axis1[i] - val, 2), 0)
  );
}

export const rectToPolygon = (rect: Rect): Polygon => {
  const { x, y, width, height } = rect;
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}

export const isPointInPolygon = (
  point: Point,
  polygon: Polygon,
  precision: number = 0,
): boolean => {
  if (polygon.length < 3) {
    throw new Error("A polygon must have at least 3 points.");
  }

  let isInside: boolean = false;
  const [x, y]: [number, number] = point;

  for (let i: number = 0, j: number = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi]: [number, number] = polygon[i];
    const [xj, yj]: [number, number] = polygon[j];

    const intersect: boolean =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
};

export const isPolygonInPolygon = (
  polygon1: Polygon,
  polygon2: Polygon,
  precision: number = 0,
) => {
  return polygon1.every((point) => isPointInPolygon(point, polygon2, precision));
}

export const isInCircle = (
  circle: Circle,
  point: Point,
  precision: number = 0,
): boolean => {
  const [cx, cy]: [number, number] = circle.center;
  const r: number = circle.radius;
  const d: number = getD([cx, cy], point);
  return d <= r + precision;
}
// #endregion

