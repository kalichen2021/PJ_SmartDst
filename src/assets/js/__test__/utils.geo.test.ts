import { test, expect } from "vitest"
import type { Point, Polygon } from "../type"
import { isPointInPolygon, isPolygonIntersectPolygon } from "../utils.geo"


test("isPointInPolygon", () => {
  const point: Point = [0, 4]
  const squere: Polygon =
    [[0, 0],
    [10, 0],
    [10, 10],
    [0, 10]]
  expect(isPointInPolygon(point, squere)).toBe(true)
})

test("isPolygonIntersectPolygon", () => {
  const polygon1: Polygon = [[6, 5], [10, 5], [10, 9], [6, 9]]
  const polygon2: Polygon = [[10, 4], [14, 4], [14, 8], [10, 8]]
  expect(isPolygonIntersectPolygon(polygon1, polygon2)).toBe(true)
})