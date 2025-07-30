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

/**
 * 矩形转换为多边形
 * @param rect 矩形
 * @returns 多边形
 * @example
 * const rect = { x: 0, y: 0, width: 100, height: 100 };
 * const polygon = rectToPolygon(rect);
 * console.log(polygon); // [[0, 0], [100, 0], [100, 100], [0, 100]]
 * // 点的顺序
 * [1, 2],
 * [4, 3]
 */
export const rectToPolygon = (rect: Rect): Polygon => {
  const { x, y, width, height } = rect;
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}

export const getCenterPoint = (polygen: Polygon): Point => {
  {
    const n = polygen.length;
    let A = 0;
    let cx = 0;
    let cy = 0;

    for (let i = 0; i < n; i++) {
      const [x0, y0] = polygen[i];
      const [x1, y1] = polygen[(i + 1) % n]; // 下一个顶点，最后一个顶点连接到第一个顶点

      const cross = (x0 * y1 - x1 * y0);
      A += cross;
      cx += (x0 + x1) * cross;
      cy += (y0 + y1) * cross;
    }

    A /= 2;
    cx /= (6 * A);
    cy /= (6 * A);

    return [cx, cy];
  }
}


export const expandPolygon = (polygon: Polygon, scaleFactor: number = 0) => {
  const newPolygon: Polygon = [] as unknown as Polygon;
  // 计算多边形的中心
  const center = getCenterPoint(polygon);
  polygon.forEach((point) => {
    const [x, y] = point;
    const [cx, cy] = center;
    const [dx, dy] = [(x - cx) * scaleFactor, (y - cy) * scaleFactor];
    // const [x2, y2] = [dx * Math.cos(scaleFactor) - dy * Math.sin(scaleFactor), dx * Math.sin(precision) + dy * Math.cos(precision)];
    newPolygon.push([cx + dx, cy + dy]);
  });
  return newPolygon;
}

/**
 * 点是否在多边形内
 * @param point 点
 * @param polygon 多边形
 * @param precision 精度
 * @returns 是否在多边形内
 */
export const isPointInPolygon = (
  point: Point,
  polygon: Polygon,
  precision: number = 1,
): boolean => {
  if (polygon.length < 3) {
    throw new Error("A polygon must have at least 3 points.");
  }
  const ePolygon = expandPolygon(polygon, precision);

  let isInside: boolean = false;
  const [x, y]: [number, number] = point;

  for (let i: number = 0, j: number = ePolygon.length - 1; i < ePolygon.length; j = i++) {
    const [xi, yi]: [number, number] = ePolygon[i];
    const [xj, yj]: [number, number] = ePolygon[j];

    const intersect: boolean =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
};

/**
 * 多边形是否在多边形内
 * @param polygon1 多边形1
 * @param polygon2 多边形2
 * @param precision 精度
 * @returns 是否在多边形内
 */
export const isPolygonInPolygon = (
  polygon1: Polygon,
  polygon2: Polygon,
  precision: number = 1,
) => {
  return polygon1.every((point) => isPointInPolygon(point, polygon2, precision));
}

/**
 * 多边形是否与多边形相交
 * @param polygon1 多边形1
 * @param polygon2 多边形2
 * @param precision 精度
 * @returns 是否与多边形相交
 */
export const isPolygonIntersectPolygon = (
  polygon1: Polygon,
  polygon2: Polygon,
  precision: number = 1,
) => {
  // 多边形1 expand 0.999 后，判断是否与多边形2 相交, 防止相切情况
  return expandPolygon(polygon1, 0.999).some((point) => isPointInPolygon(point, polygon2, precision));
}

/**
 * 点是否在圆内
 * @param circle 圆
 * @param point 点
 * @param precision 精度
 * @returns 是否在圆内
 */
export const isInCircle = (
  circle: Circle,
  point: Point,
  precision: number = 1,
): boolean => {
  const [cx, cy]: [number, number] = circle.center;
  const r: number = circle.radius;
  const d: number = getD([cx, cy], point);
  return d <= r;
}
// #endregion

