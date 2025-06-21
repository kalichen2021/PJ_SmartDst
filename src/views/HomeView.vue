<template>
  <main>
    <opera-box @click="addAppGroup" />
    <template v-for="(item, id) in appGroupInfoList" :key="item.name">
      <AppGroup :position="item.appGroupPosition" :size="item.appGroupSize"
        @created="(compInstance) => AppGroupStore.register(item.name, compInstance)"
        @destroyed="(compInstance) => unregister(item.name)" ref="elAppGroupList" />
    </template>
  </main>
</template>


<script setup lang="ts">
import { useAppGroupStore } from '@/stores/AppGroupStore';

import { onMounted, ref } from 'vue';
import type { Point } from '@/assets/js/type';

import AppGroup from '@/components/AppGroup.vue'
import OperaBox from '@/components/OperaBox.vue'

type AppGroupInintialOption = {
  name: string,
  appGroupPosition: Point,
  appGroupSize: Point,
}

const AppGroupStore = useAppGroupStore()
const { register, unregister, instances, getInstance } = AppGroupStore
const appGroupInfoList = ref<AppGroupInintialOption[]>([])

const elAppGroupList = ref<typeof AppGroup[]>()

const addAppGroup = (appGroupOption: AppGroupInintialOption) => {
  appGroupOption ??= {
    name: Date.now().toString(),
    appGroupPosition: [0, 0],
    appGroupSize: [2, 2],
  }
  appGroupInfoList.value.push(appGroupOption)
  console.log(elAppGroupList.value!.at(-1)!.name)
}

onMounted(async () => {
  appGroupInfoList.value.push(
    {
      name: "default",
      appGroupPosition: [0, 0],
      appGroupSize: [2, 2],
    }
  )
  console.log(await AppGroupStore.instances)


})
</script>
