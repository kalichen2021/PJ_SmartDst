<template>

  <canvas id="back-media"></canvas>
  <RouterView />
  <Test />

</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watch, ref, onUnmounted } from 'vue';
import { useElementStore } from '@/stores/counter';

import { canvasOperator, Particle } from './assets/js/canvas';
import type { AniNumOpt, CanvasItem, Point, Polygon, Rect } from './assets/js/type'
import { getCssVal, getD, getRandom, isInPolygon, rectToPolygon, throttle } from "./assets/js/utils"
import { UseUseOperaStore } from './stores/UserOpera';

import Test from '@/components/Test.vue';

const elementStore = useElementStore()
const userOperaStore = UseUseOperaStore()

const particles: Array<Particle>[] = []
let requestId: number | null;



const initializeParticles = (rows: number, cols: number, intervalX: number, intervalY: number) => {
  const newParticles: Array<Particle[]> = [];
  for (let col = 1; col <= cols; col++) {
    const rowParticles: Particle[] = [];
    for (let row = 1; row <= rows; row++) {
      const p = new Particle({
        x: row * intervalX,
        y: col * intervalY,
        color: "rgba(0, 163, 123, 0.5)",
        radius: 8,
      });
      rowParticles.push(p);
    }
    newParticles.push(rowParticles);
  }
  return newParticles;
};

const animateParticle = (p: Particle, squere: Polygon) => {
  // if (!p.needsUpdate) return;
  p.animate({
    radius: isInPolygon([p.x, p.y], squere) ? 20 : 8,
    duration: isInPolygon([p.x, p.y], squere) ? 100 : 400
  });
  // p.needsUpdate = false;
};

const canvasAnimate = (curPosition: Point) => {
  if (userOperaStore.ctrlState === "IDLE") {
    cancelAnimationFrame(requestId ?? 999);
    requestId = null;
    return;
  }
  const { intervalX, intervalY } = elementStore
  const { icnoGroupSize } = userOperaStore
  const squere: Polygon = rectToPolygon({
    x: curPosition[0] + intervalX * .5,
    y: curPosition[1] + intervalY * .5,
    width: intervalX * icnoGroupSize[0],
    height: intervalY * icnoGroupSize[1]
  });

  // 修改canvasAnimate中的遍历逻辑
  for (let i = 0; i < particles.length; i++) {
    const row = particles[i];
    for (let j = 0; j < row.length; j++) {
      animateParticle(row[j], squere);
    }
  }
};

watch(
  () => elementStore.intervalX,
  (c, p) => {
    const backMedia = new canvasOperator();
    const { intervalX, intervalY } = elementStore
    backMedia.init();

    const rows = Math.floor(backMedia.canvas.width / elementStore.intervalX);
    const cols = Math.floor(backMedia.canvas.height / elementStore.intervalY);
    console.log(intervalX, intervalY)

    particles.push(...initializeParticles(rows, cols, intervalX, intervalY));
    backMedia.addItem<Particle>(particles);
    backMedia.process();
  }
);


onMounted(() => {
  userOperaStore.canvasAnimate = canvasAnimate;
  userOperaStore.initializeParticles = initializeParticles;
  // document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  // cancelAnimationFrame(requestId ?? 999);
  // document.removeEventListener("mousemove", handleMouseMove);
});
</script>


<style scoped>
f {
  color: rgba(0, 163, 123, 0.546);
}
</style>
