<template>
  <div class="select-frame" ref="elSelectFrame">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SelectFrameHandler } from '../utils/mouseInteract';
import { isPolygonInPolygon } from '@/assets/js/utils';
import type { Polygon } from '@/assets/js/type';

import { useUserOperaStore, appGroupClass } from '@/stores/UserOpera';
import { watch } from 'vue';

const elSelectFrame = ref<HTMLElement | null>(null)

const userOperaStore = useUserOperaStore()


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
        if (isPolygonInPolygon(appGroupClass.appGroupPolygon as Polygon, slfHder.selectRange)) {
          console.log("在范围内")
        }
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