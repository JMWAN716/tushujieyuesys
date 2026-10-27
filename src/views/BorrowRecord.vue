<script setup>
// 借阅记录页：展示借阅记录文本（演示数据）
const records = [
  { id: 1, title: 'JavaScript 高级程序设计', borrowDate: '2026-10-01', status: '借出中' },
  { id: 2, title: 'CSS 权威指南', borrowDate: '2026-10-05', status: '已归还' },
]
</script>

<template>
  <div>
    <h2>借阅记录</h2>
    <ul>
      <li v-for="r in records" :key="r.id">
        {{ r.title }} - 借阅: {{ r.borrowDate }} - {{ r.status }}
      </li>
    </ul>
  </div>
</template>