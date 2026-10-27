<script setup>
// 布局组件：左侧菜单导航 + 右侧主内容区
// RouterLink 实现声明式页面跳转，RouterView 渲染当前路由匹配的子组件

// 菜单配置集中定义，方便后续增删
const menus = [
  { path: '/', label: '图书列表' },
  { path: '/borrow-record', label: '借阅记录' },
]
</script>

<template>
  <!-- 整体左右两栏布局 -->
  <div class="layout">
    <!-- 侧边菜单栏 -->
    <aside class="sidebar">
      <h2 class="logo">📚 图书借阅管理</h2>
      <nav>
        <!-- v-for 渲染菜单，router-link-active 会自动加在当前匹配项上做高亮 -->
        <RouterLink
          v-for="item in menus"
          :key="item.path"
          :to="item.path"
          class="nav-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <!-- 主内容区：嵌套子路由在这里渲染 -->
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 左右两栏铺满全屏 */
.layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 200px;
  background: #2c3e50;
  color: #fff;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.nav-link {
  display: block;
  padding: 12px 24px;
  color: #cfd8dc;
  text-decoration: none;
}

/* 当前激活路由的链接高亮 */
.nav-link:hover,
.nav-link.router-link-active {
  background: #409eff;
  color: #fff;
}

/* 主内容区 */
.main {
  flex: 1;
  padding: 24px;
  background: #f5f6f8;
}
</style>