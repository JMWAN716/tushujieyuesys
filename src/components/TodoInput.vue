<script setup>
// 输入框组件：用 ref 管理输入内容，点击添加时通过 emit 把内容抛给父组件
import { ref } from 'vue'

const emit = defineEmits(['add']) // 声明可向外抛出的事件名

const input = ref('') // 绑定输入框的双向数据

function handleAdd() {
  const text = input.value.trim() // 去掉首尾空格，空内容不添加
  if (!text) return
  emit('add', text) // 把内容抛给父组件
  input.value = '' // 添加后清空输入框
}
</script>

<template>
  <div class="input-row">
    <input v-model="input" placeholder="输入要购买的东西" @keyup.enter="handleAdd" />
    <button @click="handleAdd">添加</button>
  </div>
</template>