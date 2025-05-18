<template>
  <div class="icon-item" draggable="false">
    <img src="/favicon.ico" :alt="props.name">
    <span>{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

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
  font-size: 0.8rem;
  color: var(--color-text);
  text-align: center;
  /* margin-top: 0rem; */
  /* Add any additional styles for the text here */
}
</style>