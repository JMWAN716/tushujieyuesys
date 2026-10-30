import request from '../utils/request'

// 分页获取图书列表（支持 page/pageSize 分页、keyword 模糊搜索）
export function getBooks({ page = 1, pageSize = 10, keyword = '' } = {}) {
  return request.get('/books', { params: { page, pageSize, keyword } })
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