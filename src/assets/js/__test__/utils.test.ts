import { expect, test } from 'vitest'
import { autoSetItem } from "../utils";
import { nextTick } from 'process';


test('autoSetItem', async () => {
  const state = autoSetItem<number, number>({
    "active": 1,
    "driven": (val) => val + 1,
  })
  expect(state.active).toBe(1)
  // expect(state.driven).toBe(2)

  state.active = 2
  expect(state.active).toBe(2)
  expect(state.driven).toBe(3)
  console.log(state)
})