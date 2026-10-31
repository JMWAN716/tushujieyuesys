// ===== 测试全局设置 tests/setup.ts =====
// 每次运行测试前自动加载（通过 vite.config 的 test.setupFiles 引入）：
// 1) 挂载 Element Plus：让测试内所有 mount 的组件都能使用 Element Plus 组件
// 2) 清理 localStorage / sessionStorage / DOM，保证用例之间相互隔离
// 说明：MSW 服务由各涉及网络的测试文件（tests/api/*）自行 setupServer 启动管理。
//       注意：Node 测试环境下 MSW 的相对路径 handler 无法匹配，须使用 '*/api/...'（见 src/mock/handlers.js）。
import { afterEach } from 'vitest'

// --- 1）挂载 Element Plus ---
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { config } from '@vue/test-utils'
// 将 Element Plus 注册为全局插件，测试中 mount 组件时无需重复配置
config.global.plugins = [ElementPlus]

afterEach(() => {
  // --- 2）清理 localStorage / sessionStorage / DOM ---
  localStorage.clear()
  sessionStorage.clear()
  document.body.innerHTML = ''
})