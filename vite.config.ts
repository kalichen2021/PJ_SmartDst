/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@use '@/assets/css/utils' as *;"
      }
    }
  },
  test: {
    // 模拟dom环境
    environment: "happy-dom",
    coverage: {
      // 覆盖率提供者
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      // 设置覆盖文件夹
      reportsDirectory: "./coverage",
      // 检查每个文件的阈值
      // perFile: true,
      // 设置代码覆盖率阈值
      // lines: 75,
      // functions: 75,
      // branches: 75,
      // statements: 75,
    },
    open: true,
    include: [
      'src/**/__test__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
  },
})
