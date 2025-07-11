<template>
  <div class="icon-item" draggable="false" @click="LaunchApp">
    <img src="/favicon.ico" :alt="props.name">
    <span>{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  appPath: {
    type: String,
    default: "",
  }
});

const EncodeAppPath = computed(() => {
  const appPath = props.appPath ? props.appPath : "D:/Program Files/Typora/Typora.exe";
  return encodeURIComponent(appPath);
})

const LaunchApp = () => {
  // 创建临时链接元素
  const link = document.createElement('a');
  link.href = `SmartDstLauncher://${EncodeAppPath.value}`;

  // 添加必要的属性
  link.style.display = 'none';
  link.target = '_blank';

  // 添加到DOM并触发点击
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.icon-item {
  padding: .2rem;
  width: 100%;
  height: 100%;

  object-fit: cover;
  transition: all 0.3s ease;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: .2rem;
  /* border: 1px solid #f5f5f5; */

  overflow: hidden;
  transform-origin: center;
}

.icon-item:hover {
  transform: scale(1.1);
  background-color: #6565657b;
  /* Scale up the image on hover */
}

img {
  width: 70%;
  height: auto;
  object-fit: cover;
  /* border-radius: 50%; */
}

span {
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  color: var(--color-text);
  text-align: center;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>