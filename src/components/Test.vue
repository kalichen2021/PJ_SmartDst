<template>
  <div class="test-box">
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