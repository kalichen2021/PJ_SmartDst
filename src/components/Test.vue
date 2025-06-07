<template>
  <div class="test-box">
    <a href="SmartDstLauncher://D%3A%2FProgram%20Files%2FTypora%2FTypora.exe">启动调试模式</a>

    <button type="button" @click="isInvisible = !isInvisible">click me </button>
    <Transition name="rotate-ani">
      <div class="txt" v-if="isInvisible">123</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isInvisible = ref(false)
</script>

<style scoped lang="scss">
@include rotate-ani(-.5rem, 0);

.test-box {
  position: fixed;
  right: 0;
  top: 0;
  height: 500px;
  width: 200px;
  background-color: rgba(240, 248, 255, 0.493);
  overflow: auto;
  resize: both;
}

.txt {
  background-color: aliceblue;
}
</style>