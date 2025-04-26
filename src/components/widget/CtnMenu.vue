<template>
  <Transition name="move-ani">
    <div class="CtnMenu" v-show="isInvisible">
      <Transition v-for="(entry, index) in $slots.default?.()" :name="props.transitionNameList[index]" :key="index">
        <template #default>
          <component :is="entry" v-show="isInvisible" />
        </template>
      </Transition>
    </div>
  </Transition>

</template>

<script setup lang="ts">
import { onMounted, useSlots } from 'vue';


const props = defineProps({
  isInvisible: {
    type: Boolean,
    default: false
  },
  transitionNameList: {
    type: Array<string>,
    default: ['rotate-ani']
  }
});

onMounted(() => {
  const slots = useSlots();
  console.log('Slot content:', slots.default?.());
});
</script>

<style scoped lang="scss">
$width: 2rem;

.CtnMenu {
  position: absolute;
  top: .8rem;
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