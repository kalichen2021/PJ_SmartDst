<script setup lang="ts">
import { useAppGroupStore } from '@/stores/AppGroupStore';

import AppGroup from '@/components/AppGroup.vue'
import { onMounted, ref } from 'vue';
import type { Point } from '@/assets/js/type';

type AppGroupInintialOption = {
  name: string,
  appGroupPosition: Point,
  appGroupSize: Point,
}

const AppGroupStore = useAppGroupStore()
const { register, unregister, instances, getInstance } = AppGroupStore
const appGroupInfoList = ref<AppGroupInintialOption[]>([])

onMounted(() => {
  appGroupInfoList.value.push(
    {
      name: "default",
      appGroupPosition: [0, 0],
      appGroupSize: [2, 2],
    }
  )
  console.log(AppGroupStore.instances)


})
</script>

<template>
  <main>
    <template v-for="(item, id) in appGroupInfoList" :key="item.name">
      <AppGroup :position="item.appGroupPosition" :size="item.appGroupSize"
        @created="(compInstance) => AppGroupStore.register(item.name, compInstance)"
        @destroyed="(compInstance) => unregister(item.name)" />
    </template>
  </main>
</template>
