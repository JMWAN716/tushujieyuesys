<script setup>
// 图书列表页：搜索 + 分页 + el-table + 新增/编辑/删除
import { ref, onMounted, nextTick } from 'vue'
import { getBooks, addBook, updateBook, deleteBook } from '../api/book'
import { ElMessage, ElMessageBox } from 'element-plus'
import MyPagination from '../components/MyPagination.vue'

// 阴影演示数据（Element Plus 内置 box-shadow CSS 变量）
const shadowGroup = ref([
  { name: 'Basic Shadow', type: '' },
  { name: 'Light Shadow', type: 'light' },
  { name: 'Lighter Shadow', type: 'lighter' },
  { name: 'Dark Shadow', type: 'dark' },
])

// 根据类型生成变量名，如 '' -> --el-box-shadow，'light' -> --el-box-shadow-light
function getCssVarName(type) {
  return `--el-box-shadow${type ? '-' : ''}${type}`
}

const books = ref([])      // 图书数据
const loading = ref(true)  // 表格加载状态
const listTotal = ref(0)   // 总数

// 分页与搜索状态
const page = ref(1)      // 当前页
const pageSize = ref(10) // 每页条数
const keyword = ref('')  // 搜索关键词

// 弹窗与表单状态
const dialogVisible = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const form = ref({ title: '', author: '', rating: 5, available: true, stock: 0 })

// 校验规则：书名、作者必填
const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
}

// 拉取列表：携带 page/pageSize/keyword 请求
async function fetchBooks() {
  loading.value = true
  try {
    const res = await getBooks({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    books.value = res.list
    listTotal.value = res.total
  } finally {
    loading.value = false
  }
}

// 搜索：关键词改变后回到第 1 页再请求
function handleSearch() {
  page.value = 1
  fetchBooks()
}


onMounted(fetchBooks)

// 打开新增：清空表单
function openAdd() {
  editingId.value = null
  form.value = { title: '', author: '', rating: 5, available: true, stock: 0 }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 打开编辑：回填当前行
function openEdit(book) {
  editingId.value = book.id
  form.value = { title: book.title, author: book.author, rating: book.rating ?? 5, available: book.available ?? true, stock: book.stock ?? 0 }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 保存：validate 通过后按新增/编辑调用接口
async function handleSave() {
  try {
    await formRef.value.validate()
  } catch (err) {
    // 校验未通过：明确提示，不再静默
    ElMessage.warning(err?.message || '请正确填写表单信息')
    return
  }
  if (editingId.value) await updateBook(editingId.value, form.value)
  else await addBook(form.value)
  ElMessage.success('保存成功') // 确认走到了提交这一步
  dialogVisible.value = false
  fetchBooks()
}

// 删除：ElMessageBox 二次确认
async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定删除这本书吗？删除后不可恢复。', '删除确认', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
  } catch {
    return // 用户取消
  }
  await deleteBook(id)
  fetchBooks()
}
</script>

<template>
  <div>
    <div class="page-head">
      <h2>图书列表</h2>

      <!-- 搜索框 + 新增按钮 -->
      <div class="head-tools">
        <el-input
          v-model="keyword"
          placeholder="搜索书名 / 作者"
          clearable
          style="width: 240px"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="openAdd">新增图书</el-button>
      </div>
    </div>

    <!-- el-table 展示，v-loading 绑定加载态，空数据走 el-empty -->
    <el-table :data="books" v-loading="loading" stripe>
      <el-table-column prop="title" label="书名" min-width="240" />
      <el-table-column prop="author" label="作者" min-width="200" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination">
      <MyPagination v-model:page="page" v-model:pageSize="pageSize" :total="listTotal" @change="fetchBooks" />
    </div>

    <!-- 阴影演示（Element Plus Box Shadow，原生 CSS 落地） -->
    <div class="shadow-demo">
      <h3>阴影演示</h3>
      <div class="shadow-row">
        <div v-for="(shadow, i) in shadowGroup" :key="i" class="shadow-item">
          <div class="shadow-box" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }" />
          <span class="shadow-name">{{ shadow.name }}</span>
          <code class="shadow-code">{{ getCssVarName(shadow.type) }}</code>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑图书' : '新增图书'" width="420px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="50px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="form.rating" :max="5" show-score />
        </el-form-item>
        <el-form-item label="可借">
          <el-switch v-model="form.available" active-text="可借" inactive-text="不可借" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.head-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 阴影演示样式（原 UnoCSS 类的原生 CSS 等价实现） */
.shadow-demo {
  margin-top: 32px;
}
.shadow-demo h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
}
.shadow-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.shadow-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 184px; /* 对应 w="46"（46*4） */
}
.shadow-box {
  width: 120px; /* 对应 h="30" 宽 30*4 */
  height: 120px; /* 对应 h="30" 高 30*4 */
  margin: 8px;
}
.shadow-name {
  padding: 16px 0; /* 对应 p="y-4" */
  font-size: 14px; /* 对应 text="sm" */
}
.shadow-code {
  font-size: 12px; /* 对应 text="xs" */
}
</style>