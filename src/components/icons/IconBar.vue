<template>

  <!-- CSS变量控制长度 -->
  <svg :style="{ '--line-length': lineLength + 'px' }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024,1024">
    <path fill="currentColor" :d="pathData" />
  </svg>

</template>

<script setup>
import { ref, computed } from 'vue';

const lineLength = ref(3000); //默认600px

//动态计算路径数据
const pathData = computed(() => {
  const startX = (1024 - lineLength.value) / 2;
  const endX = startX + lineLength.value;
  return `
        M${startX},448 
        H${endX} 
        q64,0,64,64 
        t-64,64 
        H${startX} 
        q-64,0,-64,-64 
        t64,-64
    `;
});
</script>

<style scoped>
svg {

  transition: all .3s ease;
}

svg:hover {
  cursor: grab;
  transform: scale(1.1);
}
</style>
