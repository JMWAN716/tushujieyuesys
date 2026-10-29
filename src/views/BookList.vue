<script setup>
// 图书列表页：分页展示 + 新增/编辑弹窗 + 删除，操作后刷新列表
import { ref, onMounted } from 'vue'
import { getBooks, addBook, updateBook, deleteBook } from '../api/book'

const books = ref([])
const loading = ref(true)
const listTotal = ref(0)

// 弹窗状态
const dialogVisible = ref(false) // 是否显示弹窗
const editingId = ref(null) // 编辑的图书 id，null 表示新增
const form = ref({ title: '', author: '', price: 0 }) // 表单数据
const saving = ref(false) // 保存中标记

// 拉取第一页
async function fetchBooks() {
  loading.value = true
  try {
    const res = await getBooks(1) // 返回 { list, page, pageSize, total }
    books.value = res.list
    listTotal.value = res.total
  } finally {
    loading.value = false
  }
}
onMounted(fetchBooks)

// 打开新增弹窗：清空表单
function openAdd() {
  editingId.value = null
  form.value = { title: '', author: '', price: 0 }
  dialogVisible.value = true
}

// 打开编辑弹窗：回填选中行数据
function openEdit(book) {
  editingId.value = book.id
  form.value = { title: book.title, author: book.author, price: book.price }
  dialogVisible.value = true
}

// 保存：根据 editingId 判断新增或编辑，成功后刷新
async function handleSave() {
  if (!form.value.title || !form.value.author) return
  saving.value = true
  try {
    if (editingId.value) {
      await updateBook(editingId.value, form.value) // 编辑
    } else {
      await addBook(form.value) // 新增
    }
    dialogVisible.value = false
    fetchBooks() // 操作后刷新列表
  } finally {
    saving.value = false
  }
}

// 删除：确认后调用接口再刷新
async function handleDelete(id) {
  if (!confirm('确定删除这本书吗？')) return
  await deleteBook(id)
  fetchBooks()
}

// 测试 500：调用 /api/error，由响应拦截器统一弹 toast 错误提示
async function testError() {
    const req = (await import('../utils/request')).default
    await req.get('/error') // baseURL 已是 /api，勿重复前缀，实际请求 /api/error
}
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <h2>图书列表</h2>
        <p class="page-desc">共 {{ listTotal }} 本图书</p>
      </div>
      <button class="btn btn-primary" @click="openAdd">新增图书</button> <button class="btn" @click="testError">测试 500</button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="state">加载中...</div>

    <!-- 空数据提示 -->
    <div v-else-if="books.length === 0" class="state">暂无图书</div>

    <!-- 图书卡片网格 -->
    <div v-else class="book-grid">
      <article class="book-card" v-for="book in books" :key="book.id">
        <div class="book-cover">{{ book.title.slice(0, 1) }}</div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <div class="book-meta">
            <span class="stock">¥ {{ book.price }}</span>
            <div class="actions">
              <button class="link-btn" @click="openEdit(book)">编辑</button>
              <button class="link-btn danger" @click="handleDelete(book.id)">删除</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="dialogVisible" class="overlay" @click.self="dialogVisible = false">
      <div class="dialog">
        <h3 class="dialog-title">{{ editingId ? '编辑图书' : '新增图书' }}</h3>
        <div class="dialog-field">
          <label>书名</label>
          <input v-model="form.title" placeholder="请输入书名" />
        </div>
        <div class="dialog-field">
          <label>作者</label>
          <input v-model="form.author" placeholder="请输入作者" />
        </div>
        <div class="dialog-field">
          <label>价格</label>
          <input v-model.number="form.price" type="number" placeholder="请输入价格" />
        </div>
        <div class="dialog-actions">
          <button class="btn" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" :disabled="saving" @click="handleSave">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-desc { margin: 4px 0 0; color: var(--text-light); font-size: 14px; }

.state {
  padding: 48px 0;
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.book-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: transform 0.25s, box-shadow 0.25s;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}
.book-cover {
  width: 56px;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #409eff, #2b6dc7);
  border-radius: 8px;
}
.book-info { display: flex; flex-direction: column; flex: 1; }
.book-title { margin: 0 0 6px; font-size: 16px; }
.book-author { margin: 0 0 12px; color: var(--text-light); font-size: 14px; }
.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}
.stock { font-weight: 600; color: var(--primary); }
.actions { display: flex; gap: 10px; }
.link-btn {
  border: none;
  background: none;
  color: var(--primary);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}
.link-btn.danger { color: #f56c6c; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.dialog {
  width: 400px;
  padding: 28px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}
.dialog-title { margin: 0 0 20px; font-size: 18px; }
.dialog-field { margin-bottom: 16px; }
.dialog-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--text-light);
}
.dialog-field input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
}
.dialog-field input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
