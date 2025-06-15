<template>

  <canvas id="back-media"></canvas>
  <RouterView />
  <Test />
  <select-frame />

</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watch, ref, onUnmounted } from 'vue';
import { useUserOperaStore, iconGroupClass } from '@/stores/UserOpera';

import { canvasOperator, Particle } from './assets/js/canvas';
import type { AniNumOpt, CanvasItem, Point, Polygon, Rect } from './assets/js/type'
import { getCookie, getCssVal, getD, getRandom, isPointInPolygon, rectToPolygon, throttle } from "./assets/js/utils"


import SelectFrame from '@/components/widget/SelectFrame.vue'
import Test from './components/Test.vue';
import { getIntervalXY } from '@/components/utils/storeVal';

const interval = getIntervalXY()
const userOperaStore = useUserOperaStore()


const particles: Array<Particle>[] = []
let requestId: number | null;

const initializeParticles = (rows: number, cols: number) => {
  const newParticles: Array<Particle[]> = [];
  for (let col = 1; col <= cols; col++) {
    const rowParticles: Particle[] = [];
    for (let row = 1; row <= rows; row++) {
      const p = new Particle({
        interval,
        x: row,
        y: col,
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
    radius: isPointInPolygon([p.x, p.y], squere) ? 20 : 8,
    duration: isPointInPolygon([p.x, p.y], squere) ? 100 : 400
  });
  // p.needsUpdate = false;
};

const animateAllParticles = (squere: Polygon) => {
  for (let i = 0; i < particles.length; i++) {
    const row = particles[i];
    for (let j = 0; j < row.length; j++) {
      animateParticle(row[j], squere);
    }
  }
}


const canvasAnimate = (() => {
  // 闭包缓存优化
  let requestId: number | null = null;
  let storeCache = {
    intervalX: 0,
    intervalY: 0,
    iconGroupSize: [0, 0] as Point
  };
  const squerePool = new Map<string, Polygon>(); // 对象池优化

  return (curPosition: Point) => {
    if (userOperaStore.ctrlState === "IDLE") {
      cancelAnimationFrame(requestId ?? 999);
      requestId = null;
      return;
    }

    // 增量更新store缓存
    if (storeCache.intervalX !== interval.x ||
      storeCache.intervalY !== interval.y) {
      storeCache.intervalX = interval.x;
      storeCache.intervalY = interval.y;
    }

    // 深度比较数组内容
    if (JSON.stringify(storeCache.iconGroupSize) !== JSON.stringify(iconGroupClass.iconGroupSize)) {
      // console.log('尺寸变更:',
      //   JSON.parse(JSON.stringify(storeCache.iconGroupSize)),
      //   JSON.parse(JSON.stringify(iconGroupClass.iconGroupSize))
      // );
      storeCache.iconGroupSize = [...iconGroupClass.iconGroupSize] as Point;
    }

    // 对象池检索
    const poolKey = `${curPosition[0]},${curPosition[1]},${storeCache.iconGroupSize[0]},${storeCache.iconGroupSize[1]}`;
    let squere = squerePool.get(poolKey);

    if (!squere) {
      squere = rectToPolygon({
        x: curPosition[0] + .5,
        y: curPosition[1] + .5,
        width: storeCache.iconGroupSize[0],
        height: storeCache.iconGroupSize[1]
      });
      squerePool.set(poolKey, squere);
    }
    animateAllParticles(squere);

  };
})();



onMounted(() => {
  userOperaStore.canvasAnimate = canvasAnimate;
  userOperaStore.initializeParticles = animateAllParticles

  const backMedia = new canvasOperator();
  // const { intervalX, intervalY } = elementStore
  const interval = getIntervalXY()
  backMedia.init();

  const rows = Math.floor(backMedia.canvas.width / interval.x);
  const cols = Math.floor(backMedia.canvas.height / interval.y);
  console.log(interval.x, interval.y)

  particles.push(...initializeParticles(rows, cols));
  backMedia.addItem<Particle>(particles);
  backMedia.process();
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
