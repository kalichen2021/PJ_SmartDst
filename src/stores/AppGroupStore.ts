import { createLinkedState } from "@/assets/js/utils";
import { defineStore } from "pinia";
import { ref, type ComponentPublicInstance } from "vue";
import type { Point, Polygon } from "@/assets/js/type";
import { rectToPolygon } from "@/assets/js/utils";
import { getIntervalXY } from "@/components/utils/storeVal";

import AppGroup from "@/components/AppGroup.vue"

const getClientVal = (relVal: Point) => {
  const interval = getIntervalXY()
  const [x, y] = relVal
  return [x * interval.x, y * interval.y] as Point
}


type AppGroupInstance = InstanceType<typeof AppGroup>;


export const useAppGroupStore = defineStore('AppGroup', () => {
  // const AppGroupList = ref<any[]>([])
  // const addAppGroup = (...option: { name: string, appGroupPosition: Point, appGroupSize: Point }[]) => {
  //   option.forEach(({ name, appGroupPosition, appGroupSize }) => {
  //     AppGroupList.value.push(createLinkedState({
  //       name,
  //       appGroupPosition,
  //       appGroupSize,
  //       ...appGroupDefaultDrivenVal
  //     }))
  //   })
  // }

  // return {
  //   addAppGroup,
  //   AppGroupList
  // }
  // 错误修复：移除类式实例化，改用组合式API
  const instances = ref<Map<string, AppGroupInstance>>(new Map());

  const register = (id: string, instance: AppGroupInstance) => {
    instances.value.set(id, instance);
    console.log(`register ${id} component`)
    console.log(instances.value)

  };

  const getInstance = (id: string) => {
    return instances.value.get(id);
  };

  const unregister = (id: string) => {
    instances.value.delete(id)
    console.log(`unregister ${id} component`)
  }


  return {
    register,
    unregister,
    getInstance,
    instances
  }

})
