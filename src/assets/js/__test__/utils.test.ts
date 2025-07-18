import { expect, test } from 'vitest'
import { createLinkedState, rectToPolygon } from "../utils";
import { nextTick } from 'process';
import { reactive, ref, triggerRef, type Reactive, type Ref } from 'vue';



test('链式依赖', async () => {
  type TP_state = {
    base: number,
    double: number,
    quadruple: number
  }
  const state = createLinkedState({
    base: {
      default: 10,
      callback: () => {
        console.log("base has changed")
      }
    },
    double: ({ base }): number => base * 2,
    quadruple: {
      default: ({ double }) => (double as number) * 2
    }
  });

  expect(state.double).toBe(20);
  expect(state.quadruple).toBe(40);

  state.base = 20;
  expect(state.double).toBe(40);
  expect(state.quadruple).toBe(80);
  console.log(state.quadruple)

  // state.update({ base: 20 });
  // await nextTick(() => {
  //   expect(state.double).toBe(40);
  //   expect(state.quadruple).toBe(80);
  // });
});

test("动态性检验", () => {
  const dyn = ref(123)
  const a = createLinkedState({
    dy: reactive({
      default: dyn,
    })
  })

  expect(a.dy).toBe(123)
  dyn.value = 456
  expect(a.dy).toBe(456)
})