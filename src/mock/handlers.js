import { http, HttpResponse } from 'msw'

// 内存中的图书数据（模拟数据库）
let books = [
  { id: 1, title: 'JavaScript 高级程序设计', author: 'Jon Duckett', price: 89 },
  { id: 2, title: '深入理解计算机系统', author: 'Randal E. Bryant', price: 128 },
  { id: 3, title: 'CSS 权威指南', author: 'Eric A. Meyer', price: 99 },
]

const pageSize = 2 // 每页条数

// 统一成功响应格式：{ code, data, message }，与 request.js 拦截器约定一致
const ok = (data) => HttpResponse.json({ code: 200, data, message: 'ok' })

// 简易鉴权：校验请求头是否带 Authorization，不带则返回 401
function auth(request) {
  const hasAuth = !!request.headers.get('Authorization')
  if (!hasAuth) {
    return HttpResponse.json({ code: 401, message: '未登录或登录已过期' }, { status: 401 })
  }
  return null // 通过校验
}

export const handlers = [
  // 1）登录：返回 token 和用户信息
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json()
    // 校验通过则返回 token 与用户信息
    return ok({
      token: 'mock-token-' + Date.now(),
      user: { name: username, role: 'admin' },
    })
  }),

  // 2 & 6）分页图书列表：page 超出范围时返回空数据
  http.get('/api/books', ({ request }) => {
    const blocked = auth(request) // 需要登录才能查看
    if (blocked) return blocked
    const url = new URL(request.url)
    // 读取分页与搜索参数，pageSize 沿用默认值
    const page = Number(url.searchParams.get('page') || 1)
    const size = Number(url.searchParams.get('pageSize') || pageSize)
    const keyword = (url.searchParams.get('keyword') || '').trim()
    // 按 keyword 过滤（书名或作者包含关键词）
    let filtered = books
    if (keyword) {
      filtered = books.filter(
        (b) => b.title.includes(keyword) || b.author.includes(keyword)
      )
    }
    // 计算过滤后的总条数与总页数
    const total = filtered.length
    const totalPages = Math.ceil(total / size)
    // 切片返回当前页数据；越界时返回空数组
    const list = page > totalPages ? [] : filtered.slice((page - 1) * size, page * size)
    return ok({ list, page, pageSize: size, total })
  }),

  // 3）新增图书
  http.post('/api/books', async ({ request }) => {
    const blocked = auth(request)
    if (blocked) return blocked
    const book = await request.json()
    const newBook = { id: Date.now(), ...book }
    books.push(newBook)
    return ok(newBook)
  }),

  // 4）编辑图书
  http.put('/api/books/:id', async ({ request, params }) => {
    const blocked = auth(request)
    if (blocked) return blocked
    const data = await request.json()
    const id = Number(params.id)
    const book = books.find((b) => b.id === id)
    if (!book) return HttpResponse.json({ code: 404, message: '图书不存在' }, { status: 404 })
    Object.assign(book, data)
    return ok(book)
  }),

  // 5）删除图书
  http.delete('/api/books/:id', ({ request, params }) => {
    const blocked = auth(request)
    if (blocked) return blocked
    const id = Number(params.id)
    books = books.filter((b) => b.id !== id)
    return ok(null)
  }),

  // 7）测试接口：模拟服务器 500 错误，观察响应拦截器
  http.get('/api/error', () => {
    return HttpResponse.json(
      { code: 500, message: '服务器开小差了' },
      { status: 500 }
    )
  }),

  // 8）测试接口：依赖 Authorization 的接口（观察 401 分支）
  http.get('/api/secure', ({ request }) => {
    const blocked = auth(request)
    if (blocked) return blocked
    return ok({ secret: '你已通过鉴权看得到这段密文' })
  }),
]