// ===== MSW 接口测试：books 相关 handlers =====
// 直接发起真实 fetch 请求，由本文件自行 setupServer 拦截并返回 mock 数据。
// 不经过 axios 拦截器，纯粹验证 handlers.js 的接口行为：
// - 鉴权（未带 Authorization → 401）
// - get 分页 / keyword 过滤
// - 完整 CRUD 流程（用"测试图书"做隔离，避免污染初始 3 本数据）
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../../src/mock/handlers'

// 每个文件独立启动 MSW server，避免 jsdom 环境刷新全局 fetch 导致拦截失效
const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const BASE = 'http://localhost/api'
const AUTH = { Authorization: 'Bearer mock-token-test' }

// 默认携带鉴权头发起请求，返回 { status, body }
async function api(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { ...AUTH, ...((init.headers as Record<string, string>) || {}) },
  })
  return { status: res.status, body: await res.json() }
}

describe('books MSW handlers', () => {
  it('未带 Authorization 时返回 401', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.code).toBe(401)
  })

  it('GET /books 未传分页参数时使用默认值', async () => {
    const { status, body } = await api('/books')
    expect(status).toBe(200)
    expect(body.code).toBe(200)

    const { list, page, pageSize, total } = body.data
    expect(page).toBe(1)
    expect(pageSize).toBe(2) // handlers.js 内默认每页 2 条
    expect(total).toBe(3) // 初始 3 本
    expect(list).toHaveLength(2)
  })

  it('keyword 过滤：按书名匹配', async () => {
    const { status, body } = await api('/books?keyword=CSS')
    expect(status).toBe(200)
    const { list, total } = body.data
    expect(total).toBe(1)
    expect(list[0].title).toContain('CSS')
  })

  it('完整 CRUD：新增 → 查询 → 编辑 → 删除 → 确认删除', async () => {
    // 1) 新增
    const addRes = await api('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '测试图书', author: 'Tester', price: 1 }),
    })
    expect(addRes.status).toBe(200)
    const newBook = addRes.body.data
    expect(newBook.id).toBeTruthy()

    // 2) 新增后按关键词能查到
    const queryAfterAdd = await api('/books?keyword=测试图书')
    expect(queryAfterAdd.body.data.total).toBe(1)
    expect(queryAfterAdd.body.data.list[0].id).toBe(newBook.id)

    // 3) 编辑：修改价格
    const editRes = await api(`/books/${newBook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 99 }),
    })
    expect(editRes.status).toBe(200)
    expect(editRes.body.data.price).toBe(99)

    // 4) 删除
    const delRes = await api(`/books/${newBook.id}`, { method: 'DELETE' })
    expect(delRes.status).toBe(200)

    // 5) 删除后再查该关键词应查不到
    const queryAfterDel = await api('/books?keyword=测试图书')
    expect(queryAfterDel.body.data.total).toBe(0)
  })
})