import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useElementStore = defineStore('element', () => {
  const
    intervalX = ref(0),
    intervalY = ref(0);

  const setIntervalXY = (x: number, y: number) => {
    intervalX.value = x
    intervalY.value = y
  }

  return { intervalX, intervalY, setIntervalXY }
})