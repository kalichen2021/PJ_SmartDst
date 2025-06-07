import type { Point, Polygon } from "@/assets/js/type";
import { rectToPolygon } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";


export const UseUseOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<"MOVE" | "SCALE" | "IDLE"> = ref("IDLE")
  const iconGroupPosition: Ref<Point> = ref([0, 0])
  const icnoGroupSize: Ref<Point> = ref([3, 3])
  const canvasAnimate: Ref<(curPosition: Point) => void> = ref(() => { })
  const initializeParticles: Ref<Function> = ref(() => { })

  const getIconGroupPolygon = (): Polygon => {
    return rectToPolygon({
      x: iconGroupPosition.value[0],
      y: iconGroupPosition.value[1],
      width: icnoGroupSize.value[0],
      height: icnoGroupSize.value[1]
    })

  }

  return {
    ctrlState, iconGroupPosition, icnoGroupSize, canvasAnimate, initializeParticles
  }
})