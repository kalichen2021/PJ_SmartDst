<template>
  <div class="select-frame" ref="elSelectFrame">

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ScaleHandler } from '../utils/IconGroup';

const elSelectFrame = ref<HTMLElement | null>(null)

onMounted(() => {
  const interval = { x: 1, y: 1 }
  const selectHder = new ScaleHandler(
    elSelectFrame.value!,
    {
      interval,
      _startFnCallback: () => { },
      _processFnCallback: () => { },
      _stopFnCallback: () => { },
      maxSize: [window.innerWidth, window.innerHeight],
    },

  )
  document.onmousedown = (e) => selectHder.apply(e)
})
</script>

<style scoped>
.select-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1000;
}
</style>