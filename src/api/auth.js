import request from '../utils/request'

// 登录：发送用户名，返回 token 和用户信息
export function login(username) {
  // 注意：handlers.js 里 /api/login 期望 { username, password }
  return request.post('/login', { username, password: '123456' })
}