<template>
  <div class="CtnConf">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.CtnConf {
  position: absolute;
  top: 0;
  right: -1.5rem;
  width: 1.5rem;
  height: 1.5rem;
}

.CtnConf>* {
  margin-right: 0;
}
</style>