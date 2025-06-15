import { expect, test } from 'vitest'
import { createLinkedState, rectToPolygon } from "../utils";
import { nextTick } from 'process';
import { stat } from 'fs';


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
  // 调整属性声明顺序
  const a = createLinkedState({
    iconGroupPosition: [0, 0],
    iconGroupSize: [3, 3],
    _getIconGroupWidth: ({ iconGroupSize }) => iconGroupSize[0],
    _getGet: ({ _getIconGroupWidth }) => _getIconGroupWidth, // 移到依赖项之后
    iconGroupPolygon: ({ iconGroupPosition, iconGroupSize }) => rectToPolygon({
      x: iconGroupPosition[0],
      y: iconGroupPosition[1],
      width: iconGroupSize[0],
      height: iconGroupSize[1]
    })
  })

  // 添加异步等待
  expect(a._getGet).toBe(3)
  // await nextTick(() => {
  // })
})

test('链式依赖', async () => {
  const state = createLinkedState({
    base: 10,
    double: ({ base }): number => base * 2,
    quadruple: ({ double }) => double * 2
  });

  expect(state.double).toBe(20);
  expect(state.quadruple).toBe(40);

  state.base = 20;
  expect(state.double).toBe(40);
  expect(state.quadruple).toBe(80);

  // state.update({ base: 20 });
  // await nextTick(() => {
  //   expect(state.double).toBe(40);
  //   expect(state.quadruple).toBe(80);
  // });
});