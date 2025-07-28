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

test("类型研究", async () => {
  // 方案2: 使用Map和Proxy实现动态属性管理
  const values = new Map<string, number>();

  const state = new Proxy<{ [key: string]: number }>({}, {
    get(_target, prop: string) {
      return values.get(prop) ?? 0;
    },
    set(_target, prop: string, value: number) {
      values.set(prop, value);
      return true;
    }
  })

  // 测试属性a
  state.a = 123;
  expect(state.a).toBe(123);
  state.a = 456;
  expect(state.a).toBe(456);

  // 测试属性b
  state.b = 789;
  expect(state.b).toBe(789);
  state.b = 321;
  expect(state.b).toBe(321);

  // 测试批量插入属性
  const batchProps = { c: 111, d: 222, e: 333 };
  Object.entries(batchProps).forEach(([key, value]) => {
    state[key] = value;
  });

  expect(state.c).toBe(111);
  expect(state.d).toBe(222);
  expect(state.e).toBe(333);
})

test("cls 类型 debug", async () => {
  const cls = createLinkedState({
    position: {
      default: {
        x: 0,
        y: 0
      }
    },
    r: {
      default: 1,
    },
    area({ r }) {  // 移除显式类型标注，让TypeScript自动推断
      return r ** 2 * Math.PI
    },
    getArea<T>({ area }: { area: T }) {  // 移除显式类型标注，让TypeScript自动推断
      return area
    },
  })

  expect(cls.area).toBeCloseTo(1 * Math.PI)
  expect(cls.getArea).toBeCloseTo(1 * Math.PI)
})
