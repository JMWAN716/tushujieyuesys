import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'

// ===== mock 总开关 =====
// true  ：启用 MSW mock（开发环境拦截 /api/* 返回模拟数据）
// false ：关闭 mock，并注销已注册的 Service Worker，请求落到真实后端
const USE_MOCK = false

// 启动时按开关决定是否启用 MSW
if (USE_MOCK && import.meta.env.DEV) {
  const { setupWorker } = await import('msw/browser')
  const { handlers } = await import('./mock/handlers')
  const worker = setupWorker(...handlers)
  await worker.start()
} else if (!USE_MOCK && 'serviceWorker' in navigator) {
  // 关闭 mock：主动注销所有已注册的 Service Worker，
  // 避免之前的 mock worker 在浏览器后台继续拦截请求
  const regs = await navigator.serviceWorker.getRegistrations()
  await Promise.all(regs.map((r) => r.unregister()))
}

// 创建 Pinia 实例，并注册持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')