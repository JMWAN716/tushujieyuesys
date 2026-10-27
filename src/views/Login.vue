<script setup>
// 登录页：点击按钮模拟登录，存入 token 后跳转到图书列表
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogin() {
  // 模拟登录：把 token 写入 localStorage（路由守卫会读取它来鉴权）
  localStorage.setItem('library_token', 'mock-token-123')
  // 跳转到图书列表页（/ 的子路由渲染 BookList）
  router.push('/')
}
</script>

<template>
  <div class="login">
    <h2>图书系统登录</h2>
    <button @click="handleLogin">模拟登录</button>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
}
.login button {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  background: #409eff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>