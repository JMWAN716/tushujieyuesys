import request from '../utils/request'

// 分页获取图书列表
export function getBooks(page) {
  return request.get('/books', { params: { page } })
}

// 新增图书
export function addBook(data) {
  return request.post('/books', data)
}

// 编辑图书
export function updateBook(id, data) {
  return request.put(`/books/${id}`, data)
}

// 删除图书
export function deleteBook(id) {
  return request.delete(`/books/${id}`)
}