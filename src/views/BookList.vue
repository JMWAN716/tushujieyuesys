<script setup>
// 图书列表页：简单展示图书文本信息 + 退出登录
import { useRouter } from 'vue-router'

const router = useRouter()

const books = [
  { id: 1, title: 'JavaScript 高级程序设计', author: 'Jon Duckett' },
  { id: 2, title: '深入理解计算机系统', author: 'Randal E.Bryant' },
  { id: 3, title: 'CSS 权威指南', author: 'Eric A. Meyer' },
]

// 退出登录：删除 token 后跳回登录页
function logout() {
  localStorage.removeItem('library_token')
  router.push('/login')
}
</script>

<template>
  <div>
    <div class="toolbar">
      <h2>图书列表</h2>
      <button class="logout-btn" @click="logout">退出登录</button>
    </div>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.title }} - {{ book.author }}</li>
    </ul>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logout-btn {
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  padding: 6px 12px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #f56c6c;
  color: #fff;
}
</style>