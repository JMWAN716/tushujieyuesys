// ===== 纯逻辑单元测试：user store =====
// 不涉及组件挂载，直接测试 store 的 state / getters / actions。
// 每个用例前创建全新的 Pinia 实例，避免状态相互串扰。
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../../src/stores/user'

describe('user store', () => {
  beforeEach(() => {
    // 为每个用例注入全新的 Pinia 实例
    setActivePinia(createPinia())
  })

  it('初始状态：未登录', () => {
    const store = useUserStore()

    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({ name: '', role: '' })
    // getters 由 token / userInfo 派生
    expect(store.isLoggedIn).toBe(false)
    expect(store.username).toBe('')
  })

  it('login：写入 token 与用户信息并返回', () => {
    const store = useUserStore()
    const result = store.login('张三')

    // token 为模拟生成的，判断非空且前缀正确
    expect(store.token).toBeTruthy()
    expect(store.token.startsWith('mock-token-')).toBe(true)
    // 用户信息按传入的用户名 + 固定 admin 角色写入
    expect(store.userInfo).toEqual({ name: '张三', role: 'admin' })
    // getters 同步更新
    expect(store.isLoggedIn).toBe(true)
    expect(store.username).toBe('张三')
    // login 动作的返回值即 userInfo
    expect(result).toEqual({ name: '张三', role: 'admin' })
  })

  it('logout：清空登录态', () => {
    const store = useUserStore()
    // 先登录，确保有状态可清
    store.login('张三')
    expect(store.isLoggedIn).toBe(true)

    store.logout()

    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({ name: '', role: '' })
    expect(store.isLoggedIn).toBe(false)
    expect(store.username).toBe('')
  })
})