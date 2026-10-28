<script setup>
// 顶部导航布局：左侧 logo + 中部导航 + 右侧退出，主区渲染子路由
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const menus = [
  { path: '/', label: '图书列表' },
  { path: '/borrow-record', label: '借阅记录' },
]

// 退出登录：清空 user store（含持久化）后跳登录页
function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="layout-wrap">
    <header class="header">
      <span class="logo">📚 图书借阅管理</span>
      <nav class="nav">
        <RouterLink
          v-for="item in menus"
          :key="item.path"
          :to="item.path"
          class="nav-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="header-right">
        <span class="user">
          <span class="user-avatar">👤</span>
          {{ userStore.username || '未登录' }}
        </span>
        <button class="btn btn-danger logout-btn" @click="logout">退出登录</button>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout-wrap { min-height: 100vh; }

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #409eff, #2b6dc7);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo { font-size: 20px; font-weight: 700; letter-spacing: 1px; }

/* 导航链接 */
.nav { display: flex; gap: 8px; flex: 1; }
.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 15px;
  transition: all 0.25s;
}
.nav-link:hover { background: rgba(255, 255, 255, 0.15); color: #fff; }
.nav-link.router-link-active { background: #fff; color: #409eff; font-weight: 600; }

/* 右侧用户区 */
.header-right { display: flex; align-items: center; gap: 16px; }
.user { display: flex; align-items: center; gap: 6px; font-size: 15px; }
.user-avatar { font-size: 18px; }
.logout-btn { padding: 7px 16px; border-radius: 20px; }

/* 主内容 */
.main { padding: 32px; }
.container { max-width: 960px; margin: 0 auto; }
</style>