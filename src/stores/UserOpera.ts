import type { Point, Polygon } from "@/assets/js/type";
import { createLinkedState, getCookie, rectToPolygon } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { computed, reactive, ref, type Ref } from "vue";
import { getIntervalXY } from "@/components/utils/storeVal";



export const useUserOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<"MOVE" | "SCALE" | "IDLE" | "EDIT"> = ref("IDLE")
  // const appGroupPosition: Ref<Point> = ref([0, 0])
  // const appGroupSize: Ref<Point> = ref([3, 3])
  const canvasAnimate: Ref<(curPosition: Point) => void> = ref(() => { })
  const initializeParticles: Ref<Function> = ref(() => { })


  return {
    ctrlState,
    // appGroupPosition,
    // appGroupSize, 
    canvasAnimate, initializeParticles,
    // getAppGroupPolygon
  }
})

const getClientVal = (relVal: Point) => {
  const interval = getIntervalXY()
  const [x, y] = relVal
  return [x * interval.x, y * interval.y] as Point
}

export const appGroupClass = createLinkedState({
  name: "default",
  appGroupPosition: [0, 0] as Point,
  appGroupSize: [3, 3] as Point,
  appGroupClientPosition: ({ appGroupPosition }): Point => getClientVal(appGroupPosition),
  appGroupClientSize: ({ appGroupSize }): Point => getClientVal(appGroupSize),
  appGroupPolygon: ({ appGroupClientPosition, appGroupClientSize }) => {
    const _position = appGroupClientPosition as Point;
    const _size = appGroupClientSize as Point;
    return rectToPolygon({
      x: _position[0],
      y: _position[1],
      width: _size[0],
      height: _size[1]
    })
  }
})