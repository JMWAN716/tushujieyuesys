<script setup>
// 借阅记录页：表格形式展示借阅记录
const records = [
  { id: 1, title: 'JavaScript 高级程序设计', reader: '张三', borrowDate: '2026-10-01', dueDate: '2026-11-01', status: '借出中' },
  { id: 2, title: 'CSS 权威指南', reader: '李四', borrowDate: '2026-10-05', dueDate: '2026-11-05', status: '已归还' },
  { id: 3, title: '算法导论', reader: '张三', borrowDate: '2026-10-20', dueDate: '2026-11-20', status: '已逾期' },
]

// 状态 → 徽章色
function statusKey(status) {
  if (status === '已归还') return 'ok'
  if (status === '已逾期') return 'danger'
  return 'warn'
}
</script>

<template>
  <div class="card">
    <div class="page-head">
      <div>
        <h2>借阅记录</h2>
        <p class="page-desc">共 {{ records.length }} 条记录</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>书名</th>
          <th>借阅人</th>
          <th>借阅日期</th>
          <th>应还日期</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.title }}</td>
          <td>{{ r.reader }}</td>
          <td>{{ r.borrowDate }}</td>
          <td>{{ r.dueDate }}</td>
          <td>
            <span :class="['badge', 'badge-' + statusKey(r.status)]">{{ r.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 20px; }
.page-desc { margin: 4px 0 0; color: var(--text-light); font-size: 14px; }

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table th, .table td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid #ebeef5;
}
.table thead th {
  color: var(--text-light);
  font-weight: 600;
  background: #f5f7fa;
}
.table tbody tr:hover { background: #f5f7fa; }

.badge {
  padding: 3px 12px;
  font-size: 13px;
  border-radius: 10px;
}
.badge-ok { color: #67c23a; background: rgba(103, 194, 58, 0.12); }
.badge-warn { color: #e6a23c; background: rgba(230, 162, 60, 0.12); }
.badge-danger { color: #f56c6c; background: rgba(245, 108, 108, 0.12); }
</style>