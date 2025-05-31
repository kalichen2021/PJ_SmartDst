import type { Point } from "@/assets/js/type";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";


export const UseUseOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<"move" | "scale" | null> = ref(null)
  const iconGroupPosition: Ref<Point> = ref([0, 0])
  const icnoGroupSize: Ref<Point> = ref([3, 3])
  const moveCanvasBehaviour: Ref<(curPosition: Point) => void> = ref(() => { })
  const initializeParticles: Ref<Function> = ref(() => { })

  return {
    ctrlState, iconGroupPosition, icnoGroupSize, moveCanvasBehaviour, initializeParticles
  }
})