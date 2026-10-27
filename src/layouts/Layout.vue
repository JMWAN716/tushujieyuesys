<script setup>
// 父布局：顶部导航 + 内容区 <router-view> 渲染子路由
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('library_token')
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <header class="layout-header">
      <span class="logo">📚 图书借阅管理</span>
      <nav class="layout-nav">
        <!-- 使用 <router-link> 进行声明式跳转，to 为目标路径 -->
        <router-link to="/">图书列表</router-link>
        <router-link to="/borrow-record">借阅记录</router-link>
      </nav>
      <button class="logout-btn" @click="logout">退出登录</button>
    </header>

    <!-- 子路由渲染出口 -->
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}
.layout-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.layout-nav {
  display: flex;
  gap: 16px;
}
.layout-nav a {
  color: #333;
  text-decoration: none;
}
.logout-btn {
  margin-left: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  padding: 6px 12px;
  cursor: pointer;
}
.layout-main {
  padding: 24px;
}
</style>