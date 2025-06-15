import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { setCookie } from '@/assets/js/utils'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useElementStore = defineStore('element', () => {
  // const
  //   intervalX = ref(0),
  //   intervalY = ref(0);

  const setIntervalXY = (_interval: { x: number, y: number }) => {
    // intervalX.value = _interval.x
    // intervalY.value = _interval.y
    // 将信息存储在cookie中。
    setCookie("intervalX", _interval.x.toString());
    setCookie("intervalY", _interval.y.toString())
  }

  return { setIntervalXY }
})