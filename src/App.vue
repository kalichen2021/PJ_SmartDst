<template>

  <canvas id="back-media"></canvas>
  <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watch, ref, onUnmounted } from 'vue';
import { useElementStore } from '@/stores/counter';

import { canvasOperator, Particle } from './assets/js/canvas';
import type { AniNumOpt, CanvasItem, Polygon, Rect } from './assets/js/type'
import { getCssVal, getD, getRandom, isInPolygon, rectToPolygon, throttle } from "./assets/js/utils"
import { UseUseOperaStore } from './stores/UserOpera';

const elementStore = useElementStore()
const userOperaStore = UseUseOperaStore()

const particles: Array<Particle>[] = []
const testVal = ref(0)


const _getD = (x0: number, y0: number, x1: number, y1: number) => {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
}

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

const animateParticle = (p: Particle, radiusChange: AniNumOpt, duration: number, callbackDuration: number) => {
  p.animate(
    {
      radius: radiusChange,
      duration,
    },
    // (_this) => {
    //   _this.animate({
    //     radius: 10,
    //     duration: callbackDuration,
    //   });
    // }
  );
};


watch(
  () => elementStore.intervalX,
  (c, p) => {
    const backMedia = new canvasOperator();
    backMedia.init();

    const rows = Math.floor(backMedia.canvas.width / elementStore.intervalX);
    const cols = Math.floor(backMedia.canvas.height / elementStore.intervalY);
    console.log(elementStore.intervalX)

    particles.push(...initializeParticles(rows, cols, 57.59, 59.19));
    backMedia.addItem<Particle>(particles);
    backMedia.process();
  }
);

onMounted(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (userOperaStore.ctrlState !== "move") return;
    const squere: Polygon = rectToPolygon({
      x: userOperaStore.iconGroupPosition[0],
      y: userOperaStore.iconGroupPosition[1],
      width: elementStore.intervalX * userOperaStore.icnoGroupSize[0] * 1.1,
      height: elementStore.intervalY * userOperaStore.icnoGroupSize[1] * 1.1
    })
    for (const row of particles) {
      for (const p of row) {
        if (
          isInPolygon([p.x, p.y], squere)
        ) {
          p.animate({
            radius: 20,
            duration: 100
          })
        } else {
          p.animate({
            radius: 8,
            duration: 400
          })
        }
      }
    }
  };


  document.addEventListener("mousemove", handleMouseMove);

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
  });
});
</script>


<style scoped>
f {
  color: rgba(0, 163, 123, 0.546);
}
</style>
