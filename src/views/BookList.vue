<script setup>
// 图书列表页：卡片式展示图书信息
const books = [
  { id: 1, title: 'JavaScript 高级程序设计', author: 'Jon Duckett', category: '前端', count: 8 },
  { id: 2, title: '深入理解计算机系统', author: 'Randal E. Bryant', category: '计算机基础', count: 5 },
  { id: 3, title: 'CSS 权威指南', author: 'Eric A. Meyer', category: '前端', count: 12 },
  { id: 4, title: '算法导论', author: 'Thomas H. Cormen', category: '算法', count: 3 },
]
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <h2>图书列表</h2>
        <p class="page-desc">共 {{ books.length }} 本图书</p>
      </div>
      <button class="btn btn-primary">新增图书</button>
    </div>

    <div class="book-grid">
      <article class="book-card" v-for="book in books" :key="book.id">
        <div class="book-cover">{{ book.title.slice(0, 1) }}</div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <div class="book-meta">
            <span class="tag">{{ book.category }}</span>
            <span class="stock">库存 {{ book.count }}</span>
          </div>
        </div>
      </article>
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
.book-info { display: flex; flex-direction: column; }
.book-title { margin: 0 0 6px; font-size: 16px; }
.book-author { margin: 0 0 12px; color: var(--text-light); font-size: 14px; }
.book-meta { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.tag {
  padding: 2px 10px;
  font-size: 12px;
  color: var(--primary);
  background: rgba(64, 158, 255, 0.12);
  border-radius: 10px;
}
.stock { font-size: 13px; color: var(--text-light); }
</style>