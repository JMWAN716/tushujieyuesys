import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Vitest 单元测试配置
  test: {
    environment: 'jsdom', // 提供浏览器 DOM 环境（配合 jsdom 依赖）
    setupFiles: ['./tests/setup.ts'], // 测试前执行的全局设置
    coverage: {
      provider: 'v8', // 使用 @vitest/coverage-v8 统计覆盖率
    },
  },
})