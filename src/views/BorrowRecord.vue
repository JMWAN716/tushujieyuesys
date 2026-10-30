<script setup>
// 借阅记录页：用 el-table + el-tag 展示借阅记录
const borrowList = [
  { id: 1, bookTitle: 'JavaScript 高级程序设计', user: '张三', status: 'borrowed', overdue: false },
  { id: 2, bookTitle: '深入理解计算机系统', user: '李四', status: 'returned', overdue: false },
  { id: 3, bookTitle: '算法导论', user: '张三', status: 'borrowed', overdue: true },
]
</script>

<template>
  <div class="page-head">
    <h2>借阅记录</h2>
    <p class="page-desc">共 {{ borrowList.length }} 条记录</p>
  </div>

  <el-table :data="borrowList" stripe>
    <el-table-column prop="bookTitle" label="书名" min-width="240" />
    <el-table-column prop="user" label="借阅人" min-width="120" />
    <el-table-column label="状态" min-width="120">
      <template #default="{ row }">
        <el-tag v-if="row.status === 'borrowed'" type="warning">借阅中</el-tag>
        <el-tag v-else-if="row.status === 'returned'" type="success">已归还</el-tag>
        <el-tag v-else-if="row.overdue" type="danger">已逾期</el-tag>
      </template>
    </el-table-column>
    <template #empty>
      <el-empty description="暂无记录" />
    </template>
  </el-table>
</template>

<style scoped>
.page-head { margin-bottom: 20px; }
.page-desc { margin: 4px 0 0; color: var(--text-light); font-size: 14px; }
</style>