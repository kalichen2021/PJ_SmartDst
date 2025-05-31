<template>
  <Transition name="move-ani">
    <!-- 
    tips:
      v-if: 销毁/产生元素，不会触发动画
      v-show: 仅仅改变css，可触发动画
    -->
    <!-- 点击进入控件设置 -->
    <div class="CtnMenu" v-show="isInvisible" @click="isInvisible = false;" ref="elCtnMenu">
      <Transition v-for="(entry, index) in $slots.default?.()" :name="props.entriesConf[index].animate" :key="index">
        <template #default>
          <component :is="entry" v-show="isInvisible" @click="props.entriesConf[index].clickHandler" />
        </template>
      </Transition>
    </div>
  </Transition>

</template>

<script setup lang="ts">
import { onMounted, useSlots, ref } from 'vue';
import type { TP_entryConf } from '@/assets/js/type'
import { clickSwhToHide, isInDom } from '@/assets/js/utils'



const elCtnMenu = ref<HTMLElement | null>(null)

const apply = (el: HTMLElement) => {
  let isClicked = false
  // 右键进入菜单设置
  el.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    // 已经右键, 显示菜单
    isInvisible.value = true
    isClicked = true
    console.log("进入菜单设置")
    // 点击空白位置，隐藏菜单栏
    clickSwhToHide(elCtnMenu.value!, [])
  });

}

defineExpose({
  apply,
  dom: elCtnMenu
})

const props = defineProps({
  isInvisible: {
    type: Boolean,
    default: false
  },
  entriesConf: {
    type: Array<TP_entryConf>,
    default: ['rotate-ani']
  },
});

const isInvisible = ref<boolean>(false)

onMounted(() => {
  const slots = useSlots();
  // console.log('Slot content:', slots.default?.());
});
</script>

<style scoped lang="scss">
// 菜单栏宽度
$width: 2rem;

.CtnMenu {
  position: absolute;
  right: 1rem - $width ;
  width: $width;
  height: 2rem;

  padding: .25rem;
  border-radius: 0.25rem;
  background-color: #ffffff5f;
}

.CtnMenu>* {
  margin-left: 0;
}
</style>