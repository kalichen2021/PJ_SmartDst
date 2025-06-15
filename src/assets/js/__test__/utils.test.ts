import { expect, test } from 'vitest'
import { createLinkedState, rectToPolygon } from "../utils";
import { nextTick } from 'process';


test('autoSetItem', async () => {
  const state = createLinkedState({
    "active": 1,
    "active2": 1,
    "driven": ({ active, active2 }) => active + active2,
  })
  expect(state.active).toBe(1)
  expect(state.driven).toBe(2)

  state.active = 2
  state.active2 = 3
  expect(state.active).toBe(2)
  expect(state.driven).toBe(5)
  console.log(state)
})

test('autoSetItem1', async () => {
  const iconGroupClass =
  {
    name: "default",
    ...createLinkedState({
      "iconGroupPosition": [0, 0],
      "iconGroupSize": [3, 3],
      "iconGroupPolygon": ({ iconGroupPosition, iconGroupSize }) => rectToPolygon({
        x: iconGroupPosition[0],
        y: iconGroupPosition[1],
        width: iconGroupSize[0],
        height: iconGroupSize[1]
      })
    })
  }
  const a = createLinkedState({
    iconGroupPosition: [0, 0],
    iconGroupSize: [3, 3],
    iconGroupPolygon: ({ iconGroupPosition, iconGroupSize }) => rectToPolygon({
      x: iconGroupPosition[0],
      y: iconGroupPosition[1],
      width: iconGroupSize[0],
      height: iconGroupSize[1]
    })
  })
  expect(a.iconGroupPolygon).toStrictEqual([
    [0, 0],
    [3, 0],
    [3, 3],
    [0, 3]
  ])
  a.iconGroupPosition = [1, 1]
  a.iconGroupSize = [4, 4]
  expect(a.iconGroupPolygon).toStrictEqual([
    [1, 1],
    [5, 1],
    [5, 5],
    [1, 5]
  ])
})