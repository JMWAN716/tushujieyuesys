<script setup>
// 登录页：输入用户名 → 调用 user store 登录 → 跳转图书列表
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  if (!username.value.trim()) return
  userStore.login(username.value)
  router.push('/')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">📚</div>
      <h1 class="title">图书借阅管理系统</h1>
      <p class="subtitle">欢迎回来，请登录您的账号</p>

      <div class="field">
        <input
          v-model="username"
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </div>

      <button class="btn btn-primary login-btn" @click="handleLogin">登录</button>
      <p class="tip">模拟登录：输入任意用户名即可进入</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f1ff, #f0f5ff);
}
.login-card {
  width: 380px;
  padding: 40px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.15);
  text-align: center;
}
.login-logo {
  width: 64px;
  height: 64px;
  line-height: 64px;
  margin: 0 auto 16px;
  font-size: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #409eff, #2b6dc7);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}
.title { margin: 0 0 8px; font-size: 22px; }
.subtitle { margin: 0 0 28px; color: var(--text-light); font-size: 14px; }
.field { margin-bottom: 20px; }
.field input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.field input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}
.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
}
.tip { margin: 16px 0 0; font-size: 12px; color: var(--text-light); }
</style>