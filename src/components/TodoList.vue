<script setup>
// 列表组件：用 props 接收父组件传入的 list，用 v-for 渲染，
// 删除时通过 emit 把下标抛给父组件去真正删除
defineProps({
  list: { type: Array, default: () => [] },
})

const emit = defineEmits(['remove'])
</script>

<template>
  <ul class="todo-list">
    <li v-for="(item, index) in list" :key="item" class="todo-item">
      <span>{{ index + 1 }}. {{ item }}</span>
      <button @click="emit('remove', index)">删除</button>
    </li>
  </ul>
</template>