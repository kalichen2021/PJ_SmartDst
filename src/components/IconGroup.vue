<template>
  <div class="icon-group">
    <div class="border-container" ref="elIconGrpCtn">
      <span class="bar controller"><icon-bar /></span>
      <div class="container">
        <div v-for="icon in icons" :key="icon.id">
          <icon-app :name="icon.name" />
        </div>
      </div>
      <span class="scaler controller"><icon-arrows-rotate /></span>
    </div>
    <span>文件夹</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rightClickHandler, resize } from './utils/IconGroup.tsx';
import IconApp from './icons/IconApp.vue';
import IconBar from './icons/IconBar.vue';
import IconArrowsRotate from './icons/IconArrowsRotate.vue';
import { watchEffect } from 'vue';

const icons = ref([
  { id: 1, name: 'home' },
  { id: 2, name: 'settings' },
  { id: 3, name: 'user' },
  { id: 4, name: 'search' },
  { id: 5, name: 'bell' },
  { id: 6, name: 'heart' },
  { id: 7, name: 'star' },
  { id: 8, name: 'camera' },
  { id: 9, name: 'video' },
  { id: 10, name: 'music' },
]);

const elIconGrpCtn = ref<HTMLElement | null>(null)

onMounted(() => {
  const isElIconGrpCtnConf = ref<Boolean>(false)
  const GrpCtnCotroller = elIconGrpCtn.value!.querySelectorAll(".controller") as NodeListOf<HTMLElement>
  watchEffect(() => {
    console.log(isElIconGrpCtnConf.value)
    // 显示操作控件
    if (isElIconGrpCtnConf.value) {
      console.log(GrpCtnCotroller);
      [...GrpCtnCotroller].forEach((el) => el!.style.display = "block")
    }
  })

  // 右键设置
  elIconGrpCtn.value!.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    console.log("right click")
    rightClickHandler(elIconGrpCtn.value!, isElIconGrpCtnConf);
  });
})
</script>

<style scoped lang="scss">
@mixin display-c {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon-group {
  --grid-box-size-w: calc(var(--icon-size) * 3);
  --grid-box-size-h: calc(var(--icon-size) * 3);
  border: red 1px solid;
  /* Set the icon size here */
  @include display-c;
  width: calc(var(--icon-size) + var(--grid-box-size-w));
  height: calc(var(--icon-size) + var(--grid-box-size-h));

}

.border-container {
  position: relative;
  border: 1px solid #ff0000;
  border-radius: 1rem;
  @include display-c;
  width: calc(var(--icon-size)*1/4 + var(--grid-box-size-w));
  height: calc(var(--icon-size)*1/3 + var(--grid-box-size-h));
}

.border-container .controller {
  position: absolute;
  display: none;
}

.border-container .controller svg {
  width: 100%;
  height: 100%;
}

.border-container .bar {
  top: 0;
  width: 5rem;
  height: 1rem;
}

.border-container .scaler {
  position: absolute;
  width: 1rem;
  height: 1rem;
  bottom: -.05rem;
  right: -.05rem;
}

.border-container .scaler svg {
  position: absolute;
  bottom: 0;
  right: 0;
}

.container {
  // border: red 1px solid;
  display: grid;
  /* 3*3布局，每个格子最大为32px, 超出3行scroll*/

  /* gap: 10px; */
  grid-template-columns: repeat(3, var(--icon-size));
  grid-template-rows: repeat(3, var(--icon-size));

  overflow-y: auto;
  overflow-x: hidden;
  max-width: var(--grid-box-size-w);
  max-height: var(--grid-box-size-h);
}

/* 设置滚动条样式 */
.container {
  /* Add any additional styles for the scrollbar here */
  scrollbar-width: none;
  /* For Firefox */
  scrollbar-color: #00a170 #000000;

  /* For Firefox */
  /* Custom scrollbar styles for WebKit browsers */
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #00a170;
    /* Updated color for the scrollbar thumb */
    border-radius: 2px;
  }
}

span {
  font-size: 0.9rem;
  color: var(color-text);
  text-align: center;
  /* margin-top: 0rem; */
  /* Add any additional styles for the text here */
}
</style>