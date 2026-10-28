import { defineStore } from 'pinia'

// user store：管理登录状态与用户信息（开启持久化，刷新后登录态自动保留）
export const useUserStore = defineStore('user', {
  // 状态
  state: () => ({
    token: '', // token，由持久化插件自动写入 localStorage
    userInfo: { name: '', role: '' }, // 用户信息：姓名 + 角色
  }),

  getters: {
    // 是否已登录：有 token 即为已登录
    isLoggedIn: (state) => !!state.token,
    // 当前登录用户名（由 userInfo.name 派生）
    username: (state) => state.userInfo.name,
  },

  actions: {
    // 模拟登录：生成 token 并保存用户信息
    login(username) {
      this.token = 'mock-token-' + Date.now() // 模拟生成 token（真实项目由后端返回）
      this.userInfo = { name: username, role: 'admin' } // 模拟角色
      return this.userInfo
    },

    // 退出登录：清空 token 和用户信息
    logout() {
      this.token = ''
      this.userInfo = { name: '', role: '' }
    },
  },

  // persist: true 开启状态持久化（默认 key 为 store id 'user'，存到 localStorage）
  persist: true,
})