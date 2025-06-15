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

// export const useElementStore = defineStore('element', () => {
//   const setIntervalXY = (_interval: { x: number, y: number }) => {

//     // 将信息存储在cookie中。
//     setCookie("intervalX", _interval.x.toString());
//     setCookie("intervalY", _interval.y.toString())
//   }

//   return { setIntervalXY }
// })
