import type { Point, Polygon } from "@/assets/js/type";
import { createLinkedState, getCookie, rectToPolygon } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { computed, reactive, ref, type Ref } from "vue";
import { getIntervalXY } from "@/components/utils/storeVal";



export const useUserOperaStore = defineStore('userOpera', () => {
  const ctrlState: Ref<"MOVE" | "SCALE" | "IDLE" | "EDIT"> = ref("IDLE")
  // const iconGroupPosition: Ref<Point> = ref([0, 0])
  // const iconGroupSize: Ref<Point> = ref([3, 3])
  const canvasAnimate: Ref<(curPosition: Point) => void> = ref(() => { })
  const initializeParticles: Ref<Function> = ref(() => { })


  return {
    ctrlState,
    // iconGroupPosition,
    // iconGroupSize, 
    canvasAnimate, initializeParticles,
    // getIconGroupPolygon
  }
})

const getClientVal = (relVal: Point) => {
  const interval = getIntervalXY()
  const [x, y] = relVal
  return [x * interval.x, y * interval.y] as Point
}

export const iconGroupClass = createLinkedState({
  name: "default",
  iconGroupPosition: [0, 0] as Point,
  iconGroupSize: [3, 3] as Point,
  iconGroupClientPosition: ({ iconGroupPosition }): Point => getClientVal(iconGroupPosition),
  iconGroupClientSize: ({ iconGroupSize }): Point => getClientVal(iconGroupSize),
  iconGroupPolygon: ({ iconGroupClientPosition, iconGroupClientSize }) => {
    const _position = iconGroupClientPosition as Point;
    const _size = iconGroupClientSize as Point;
    return rectToPolygon({
      x: _position[0],
      y: _position[1],
      width: _size[0],
      height: _size[1]
    })
  }
})