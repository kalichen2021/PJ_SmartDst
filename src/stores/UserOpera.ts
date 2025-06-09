import type { iconGroupClass, Point, Polygon } from "@/assets/js/type";
import { createLinkedState, rectToPolygon } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { computed, reactive, ref, type Ref } from "vue";


export const UseUserOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<"MOVE" | "SCALE" | "IDLE" | "EDIT"> = ref("IDLE")
  // const iconGroupPosition: Ref<Point> = ref([0, 0])
  // const iconGroupSize: Ref<Point> = ref([3, 3])
  const canvasAnimate: Ref<(curPosition: Point) => void> = ref(() => { })
  const initializeParticles: Ref<Function> = ref(() => { })

  const iconGroupClass = createLinkedState({
    name: "default",
    iconGroupPosition: [0, 0],
    iconGroupSize: [3, 3],
    iconGroupPolygon: ({ iconGroupPosition, iconGroupSize }) => rectToPolygon({
      x: iconGroupPosition[0],
      y: iconGroupPosition[1],
      width: iconGroupSize[0],
      height: iconGroupSize[1]
    })
  })

  // const getIconGroupClass = (): iconGroupClass => {
  //   return []
  // }

  // const getIconGroupPolygon = (): Polygon => {
  //   return rectToPolygon({
  //     x: iconGroupPosition.value[0],
  //     y: iconGroupPosition.value[1],
  //     width: iconGroupSize.value[0],
  //     height: iconGroupSize.value[1]
  //   })

  // }

  return {
    ctrlState,
    // iconGroupPosition,
    // iconGroupSize, 
    canvasAnimate, initializeParticles,
    iconGroupClass
    // getIconGroupPolygon
  }
})