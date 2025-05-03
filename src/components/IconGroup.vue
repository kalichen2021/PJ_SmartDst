<template>
  <div class="icon-group" ref="elIconGrp">
    <div class="border-container" ref="elIconGrpCtn">
      <div class="container" ref="elGridCtn">
        <div v-for="icon in icons" :key="icon.id" draggable="false" ref="elIconWrap">
          <icon-app :name="icon.name" />
        </div>
      </div>
      <!-- 拖动控件 -->
      <span class="bar controller" draggable="true" ref="elGrabBar"><icon-bar /></span>
      <!-- 缩放控件 -->
      <span class="scaler controller" ref="elScaler"><icon-arrows-rotate /></span>
    </div>
    <CtnMenu :entries-conf="entriesConf!" ref="elCtnMenu">
      <IconMore />
    </CtnMenu>
    <span>文件夹</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { rightClickHandler, moveHandler, scaleHandler } from './utils/IconGroup.tsx';
import type { TP_entryConf } from '@/assets/js/type'

import IconApp from './icons/IconApp.vue';
import IconBar from './icons/IconBar.vue';
import IconMore from './icons/IconMore.vue';
import IconArrowsRotate from './icons/IconArrowsRotate.vue';

import CtnMenu from '@/components/widget/CtnMenu.vue'
import { clickSwhToHide, isInDom } from '@/assets/js/utils';

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

const elIconGrp = ref<HTMLElement | null>(null)
const elIconGrpCtn = ref<HTMLElement | null>(null)
const elGridCtn = ref<HTMLElement | null>(null)
const elIconWrap = ref<[HTMLElement] | null>(null)
const elGrabBar = ref<HTMLElement | null>(null)
const elScaler = ref<HTMLElement | null>(null)
const entriesConf = ref<[TP_entryConf]>()
// tips: InstanceType 实例类型
const elCtnMenu = ref<InstanceType<typeof CtnMenu> | null>(null)

const isRightClicked = ref(false)

let elIconMoreClick: any

onMounted(() => {
  // 文件图标组是否为编辑状态
  const isElIconGrpCtnConf = ref<Boolean>(false)
  // 获取控制器元素
  const GrpCtnController =
    elIconGrpCtn.value!.querySelectorAll(".controller") as NodeListOf<HTMLElement>;

  /**
   * 编辑文件图标组步骤说明；
   * 1. 文件图标组是否被右击 ---y--> 右键菜单
   * 2. 右键菜单中编辑选项是否被点击 ---y--> 文件图标组设置为编辑状态
   * 3. 监听文件图标组是否为编辑状态 ---y--> 显示操作控件
   * 
   * 编辑状态下，文件图标组的控制器可拖动、缩放
   */


  // 应用右键菜单
  elCtnMenu.value!.apply(elIconGrpCtn.value!)
  // 右键菜单条目设置
  entriesConf.value = [{
    name: "SetGrp",
    animate: "rotate-ani",
    // 点击进入控件设置
    clickHandler: () => {
      // 允许拖动控件工作
      elGrabBar.value!.draggable = true;
      [...GrpCtnController].forEach((el) => el!.style.display = "block")

      // 点击空白位置，隐藏控件
      clickSwhToHide([...GrpCtnController], [elCtnMenu.value!.dom!, elIconGrp.value!])
    }
  }]

  // 控件事件
  const iconSize = elIconWrap.value![0].getBoundingClientRect(); // Use the first element in the array
  const mvHder = new moveHandler(elIconGrp.value!);
  const sclHder = new scaleHandler(
    elGridCtn.value!,
    {
      width: iconSize.width,
      height: iconSize.height
    },
    // 添加过渡
    // _start 回调
    () => {
      const _style = "all .5s"
      elIconGrp.value!.style.transition = _style
      elIconGrpCtn.value!.style.transition = _style
      elGridCtn.value!.style.transition = _style
    },
    // _stop 回调
    () => {
      elIconGrp.value!.style.removeProperty('transition')
      elIconGrpCtn.value!.style.removeProperty('transition')
      elGridCtn.value!.style.removeProperty('transition')
    }
  );

  // 应用控件功能
  elGrabBar.value!.onmousedown = (e) => mvHder.apply(e);
  elScaler.value!.onmousedown = (e) => sclHder.apply(e);

})
</script>

<style scoped lang="scss">
@include rotate-ani(0, -.5rem);
@include move-ani(0, -.5rem);

// tips: 不同单位变量换算用calc()
$grid-box-size-w: calc($icon-w * 3);
$grid-box-size-h: calc($icon-h * 3);
$grp-padding-w: calc($icon-w * 0.5 - $ctn-padding);
$grp-padding-h: calc($icon-h * 0.5 - $ctn-padding);


.icon-group {
  position: relative;
  // tips: outline 相比 border 不会影响元素的尺寸
  outline: red 1px solid;
  @include display-lt;
  width: fit-content;
  height: fit-content;
  // tips: padding: <padding-col> <>padding-row>
  padding: #{$grp-padding-h} #{$grp-padding-w};

  // user-select: none;
  // -webkit-user-drag: none;
}


.border-container {
  position: relative;
  outline: 1px solid #ff0000;
  border-radius: 1rem;
  padding: $ctn-padding;
  @include display-c;
  // width: calc(var(--icon-size)*1/4 + var(--grid-box-size-w));
  // height: calc(var(--icon-size)*1/3 + var(--grid-box-size-h));
  user-select: none;

  overflow: hidden;
  // resize: both;
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
  top: $ctn-padding * -1;
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
  // 加上内边距
  --grid-col-size: calc(var(--icon-size) - var(--ctn-padding)*2);
  // 减去应用名称文本高度
  --grid-row-size: calc(var(--icon-size) - .15rem - var(--ctn-padding)*2);
  display: grid;
  /* 3*3布局，每个格子最大为32px, 超出3行scroll*/

  /* gap: 10px; */
  grid-template-columns: repeat(auto-fit, minmax(#{$icon-w}, 1fr));
  // 减去文本高度
  grid-template-rows: repeat(auto-fit, minmax(#{$icon-h}, 1fr));

  overflow-y: auto;
  overflow-x: hidden;
  max-width: #{$grid-box-size-w};
  max-height: #{$grid-box-size-h};

  // // 改变容器大小
  // resize: both;
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
  width: 100%;
  height: 0;
  font-size: 0.9rem;
  color: var(color-text);
  text-align: center;
  /* margin-top: 0rem; */
  /* Add any additional styles for the text here */
}
</style>