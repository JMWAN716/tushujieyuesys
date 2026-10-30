<script setup>
// 通用分页组件：封装 el-pagination
// props：total 总条数、page 当前页、pageSize 每页条数（父组件用 v-model 绑定）
// emit ：update:page / update:pageSize 同步值，change 通知父组件重新请求
defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

// 页码变化：更新 v-model 并触发 change，让父组件重新拉取数据
function onCurrentChange(p) {
  emit('update:page', p)
  emit('change')
}

// 每页条数变化：更新 v-model 并回到第 1 页，再触发 change
function onSizeChange(size) {
  emit('update:pageSize', size)
  emit('update:page', 1)
  emit('change')
}
</script>

<template>
  <el-pagination
    :total="total"
    :current-page="page"
    :page-size="pageSize"
    :page-sizes="[5, 10, 20]"
    layout="total, sizes, prev, pager, next, jumper"
    background
    @current-change="onCurrentChange"
    @size-change="onSizeChange"
  />
</template>