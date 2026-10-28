import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// 路由懒加载：() => import(...)，访问到该路由时才动态加载对应组件，减少首屏体积
const routes = [
  // 登录页：无需 requiresAuth，放最外层，独占一整页
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  // 父布局 Layout：包裹所有需要登录后才能访问的页面
  {
    path: '/',
    name: 'layout',
    component: () => import('../layouts/Layout.vue'),
    meta: { requiresAuth: true }, // 进入该布局前必须登录
    children: [
      // 默认子路由：访问 / 或 /books 都渲染 BookList
      {
        path: '',
        alias: 'books',
        name: 'bookList',
        component: () => import('../views/BookList.vue'),
      },
      // 借阅记录页面
      {
        path: 'borrow-record',
        name: 'borrowRecord',
        component: () => import('../views/BorrowRecord.vue'),
      },
    ],
  },
  // 404 兜底：任意未匹配路径统一重定向到登录页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时的滚动行为：默认回到顶部；有保存位置则恢复（浏览器的前进/后退）
  scrollBehavior(to, from, savedPosition) {
    return savedPosition && typeof savedPosition !== 'undefined'
      ? savedPosition
      : { top: 0, left: 0 }
  },
})

// 全局前置守卫：每次路由跳转前都会执行
router.beforeEach((to, from, next) => {
  // 读取 user store 判断是否已登录（内部由 token 派生）
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // 目标页面需要登录但未登录 → 去登录页
  if (requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login' })
  } else {
    // 已登录用户访问登录页 → 直接进主页（可选优化，避免反复登录）
    if (to.path === '/login' && userStore.isLoggedIn) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router