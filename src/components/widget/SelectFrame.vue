<template>
  <div class="select-frame" ref="elSelectFrame">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SelectFrameHandler } from '../utils/MouseInteract';
import { clickSwhToHide, isPolygonInPolygon } from '@/assets/js/utils';
import type { Polygon } from '@/assets/js/type';

import { useUserOperaStore, appGroupClass } from '@/stores/UserOpera';
import { useAppGroupStore } from '@/stores/AppGroupStore';
import { watch } from 'vue';

const elSelectFrame = ref<HTMLElement | null>(null)

const userOperaStore = useUserOperaStore()
const AppGroupStore = useAppGroupStore()


onMounted(() => {
  const interval = { x: 1, y: 1 }
  const slfHder = new SelectFrameHandler(
    // #region 应用缩放功能
    elSelectFrame.value!,
    {
      interval,
      _processFnCallback() {

      },
      _stopFnCallback() {
        // console.log(appGroupClass.debug())
        let isInRange = false
        AppGroupStore.instances.forEach((item) => {
          if (isPolygonInPolygon(item.appGroupPolygon as Polygon, slfHder.selectRange)) {
            isInRange = true
            item.enableEdit()
            item.state = "EDITING"
            console.log(item.name, "在范围内")
          }
        })
        // else {
        //   console.log(slfHder.selectRange)
        // }
      }
    }
  )
  document.onmousedown = e => {
    if (userOperaStore.ctrlState !== "IDLE") return
    slfHder.dragable = true
    slfHder.apply(e)
  }

})
</script>

<style scoped>
.select-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 1000;

  outline: 1px dashed #00ff9d;
  border-radius: 10px;
}
</style>