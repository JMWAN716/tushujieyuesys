// ===== 组合实验：登录 → 存 token → 带 Authorization 访问受保护接口 =====
// 完整走一遍真实鉴权链路：
// 1) POST /api/login 拿到 token
// 2) 把 token 写入 user store（与项目真实登录流程一致）
// 3) 携带 Authorization 访问 /api/protected → 成功
// 4) 不带 Authorization（无 token 场景）访问 /api/protected → 401
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { setupServer } from 'msw/node'
import { useUserStore } from '../../src/stores/user'
import { handlers } from '../../src/mock/handlers'

// 每个文件独立启动 MSW server，避免 jsdom 环境刷新全局 fetch 导致拦截失效
const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const BASE = 'http://localhost/api'

async function jsonFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(BASE + path, init)
  return { status: res.status, body: await res.json() }
}

describe('组合实验：登录 → 鉴权访问 /api/protected', () => {
  // 为每个用例注入全新 Pinia，模拟干净的用户态
  beforeEach(() => setActivePinia(createPinia()))

  it('完整链路：登录拿 token → 存入 store → 带 Authorization 访问成功', async () => {
    // 1) 登录，得到 token
    const loginRes = await jsonFetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '张三', password: '123456' }),
    })
    expect(loginRes.status).toBe(200)
    const { token, user } = loginRes.body.data
    expect(token).toBeTruthy()
    expect(user.name).toBe('张三')

    // 2) 存 token → 写入 user store（真实流程同样如此）
    const userStore = useUserStore()
    userStore.token = token
    userStore.userInfo = user
    expect(userStore.isLoggedIn).toBe(true)

    // 3) 带 Authorization 访问受保护接口 → 成功
    const okRes = await jsonFetch('/protected', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(okRes.status).toBe(200)
    expect(okRes.body.code).toBe(200)
    expect(okRes.body.data.message).toContain('受保护')
  })

  it('无 token（不带 Authorization）访问 /api/protected → 401', async () => {
    const res = await fetch(`${BASE}/protected`)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.code).toBe(401)
  })
})