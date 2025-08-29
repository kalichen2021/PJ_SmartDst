import type { Point, Polygon, UserOperaState } from "@/assets/js/type";
import { createLinkedState, getCookie, rectToPolygon } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { computed, reactive, ref, type Ref } from "vue";
import { getIntervalXY } from "@/components/utils/StoreInterval";



// Global State Manager
export const useUserOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<UserOperaState> = ref("IDLE")
  // const appGroupPosition: Ref<Point> = ref([0, 0])
  // const appGroupSize: Ref<Point> = ref([3, 3])
  const canvasAnimate: Ref<(appGroupId: string) => void> = ref(() => { })
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
  appGroupPolygon: ({ appGroupPosition, appGroupSize }) => {
    return rectToPolygon({
      x: appGroupPosition[0],
      y: appGroupPosition[1],
      width: appGroupSize[0] + 1,
      height: appGroupSize[1] + 1
    })
  },
  appGroupClientPosition: ({ appGroupPosition }: { appGroupPosition: Point }): Point => getClientVal(appGroupPosition),
  appGroupClientSize: ({ appGroupSize }: { appGroupSize: Point }): Point => getClientVal(appGroupSize),
  appGroupClientPolygon: ({ appGroupClientPosition, appGroupClientSize }): Polygon => {
    return rectToPolygon({
      x: appGroupClientPosition[0],
      y: appGroupClientPosition[1],
      width: appGroupClientSize[0],
      height: appGroupClientSize[1]
    })
  }
})