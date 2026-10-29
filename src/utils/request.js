import axios from 'axios'
import { useUserStore } from '../stores/user'
import { showToast } from './toast'

// 创建 axios 实例：统一定义请求配置
const request = axios.create({
  baseURL: '/api', // 所有请求自动拼接该前缀（如 get('/books') → /api/books）
  timeout: 10000, // 超时时间 10s
})

// 请求拦截器：在发出请求前给所有请求加上鉴权头
request.interceptors.request.use(
  (config) => {
    // 从 user store 读取当前 token
    const userStore = useUserStore()
    // 若有 token，则放入 Authorization 头（Bearer 格式）
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理响应数据与错误
request.interceptors.response.use(
  (response) => {
    // 业务约定：code === 200 视为成功，直接返回 data
    const { code, data, message } = response.data
    if (code === 200) {
      return data
    }
    // 其它业务码（非 200）统一当作失败抛出
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // HTTP 层错误：根据状态码分类处理
    const status = error.response?.status
    if (status === 401) {
      // 未授权：清空登录态并跳转登录页
      useUserStore().logout()
      window.location.href = '/login'
    } else if (status >= 500) {
      // 服务器错误：toast 提示（alert 可能被浏览器拦截）
      showToast('服务器错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

// 导出封装好的请求实例
export default request