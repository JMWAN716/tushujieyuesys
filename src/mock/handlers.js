import { http, HttpResponse } from 'msw'

// 内存中的图书数据（模拟数据库）
let books = [
  { id: 1, title: 'JavaScript 高级程序设计', author: 'Jon Duckett', price: 89 },
  { id: 2, title: '深入理解计算机系统', author: 'Randal E.Bryant', price: 128 },
  { id: 3, title: 'CSS 权威指南', author: 'Eric A. Meyer', price: 99 },
]

const pageSize = 2 // 每页条数

export const handlers = [
  // 1）登录：返回 token 和用户信息
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json()
    // 校验通过则返回 token 与用户信息
    return HttpResponse.json({
      token: 'mock-token-123',
      user: { id: 1, username },
    })
  }),

  // 2 & 6）分页图书列表：page 超出范围时返回空数据
  http.get('/api/books', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const totalPages = Math.ceil(books.length / pageSize)
    // page 大于总页数时模拟空数据
    const list = page > totalPages ? [] : books.slice((page - 1) * pageSize, page * pageSize)
    return HttpResponse.json({ list, page, pageSize, total: books.length })
  }),

  // 3）新增图书
  http.post('/api/books', async ({ request }) => {
    const book = await request.json()
    const newBook = { id: Date.now(), ...book }
    books.push(newBook)
    return HttpResponse.json(newBook, { status: 201 })
  }),

  // 4）编辑图书
  http.put('/api/books/:id', async ({ request, params }) => {
    const data = await request.json()
    const id = Number(params.id)
    const book = books.find((b) => b.id === id)
    if (!book) return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    Object.assign(book, data)
    return HttpResponse.json(book)
  }),

  // 5）删除图书
  http.delete('/api/books/:id', ({ params }) => {
    const id = Number(params.id)
    books = books.filter((b) => b.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]