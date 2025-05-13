<template>

  <canvas id="back-media"></canvas>
  <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watch, ref } from 'vue';
import { useElementStore } from '@/stores/counter';

import { canvasOperator, Particle } from './assets/js/canvas';
import type { CanvasItem } from './assets/js/type'
import { getCssVal, getRandom } from "./assets/js/utils"

const elStore = useElementStore()
const particles: Array<Particle>[] = []
const testVal = ref(0)

const _initRadius = (particles: Array<Particle[]>) => {
  particles.forEach((row) => {
    row.forEach((p) => {
      p.animate({
        radius: 10,
        duration: 200
      })
    })
  })
}

watch(
  () => elStore.intervalX,
  (c, p) => {
    const backMedia = new canvasOperator();
    backMedia.init();
    const
      intervalX = elStore.intervalX,
      intervalY = elStore.intervalY;
    const rows = Math.floor(backMedia.canvas.width / intervalX)
    const cols = Math.floor(backMedia.canvas.height / intervalY)
    console.log({ rows, cols })
    for (let col = 1; col <= cols; col += 1) {
      let _rowParticles = []
      for (let row = 1; row <= rows; row += 1) {
        const p = new Particle({
          x: row * intervalX,
          y: col * intervalY,
          color: "rgba(0, 163, 123, 0.546)",
          radius: 10,
        })
        _rowParticles.push(p)
      }
      particles.push(_rowParticles)
    }
    // console.log(particles)
    backMedia.addItem<Particle>(particles)
    // backMedia.addItem<Particle>([new Particle({
    //   x: intervalX * 5,
    //   y: intervalY * 5,
    //   color: "rgba(0, 163, 123, 0.546)",
    //   radius: 10,
    // })])

    backMedia.process()
    document.addEventListener("mousemove", (e) => {
      const indexX = Math.floor(e.clientX / intervalX + .5)
      const indexY = Math.floor(e.clientY / intervalY + .5)
      if (indexX <= rows && indexY <= cols && indexX > 0 && indexY > 0) {
        backMedia.getItem<Particle>(indexY - 1, indexX - 1)!.animate({
          radius: 20,
          duration: 100
        }, (_this) => {
          _this.animate({
            radius: 10,
            duration: 500
          })
        })

      }
      // if (indexX == 5 && indexY == 5) {
      //   // _initRadius(backMedia.items as Particle[][])
      //   backMedia.getItem<Particle>(0, 0)!.animate({
      //     radius: 20,
      //     duration: 500
      //   }, (_this) => {
      //     _this.animate({
      //       radius: 10,
      //       duration: 100
      //     })
      //   })

      // }
    })
  }
)

onMounted(() => {



})
</script>


<style scoped>
f {
  color: rgba(0, 163, 123, 0.546);
}
</style>
