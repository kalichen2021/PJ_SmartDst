<template>
  <div class="opera-box">
    <span id="btn-add" ref="elBtnAdd">
      <icon-add />
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IconAdd from './icons/IconAdd.vue'
import AppGroup from './AppGroup.vue';


const elBtnAdd = ref<HTMLDivElement>()

const emit = defineEmits(['click'])
onMounted(() => {
  elBtnAdd.value?.addEventListener('click', () => {
    emit('click')
  })
})
</script>

<style scoped>
.opera-box {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>