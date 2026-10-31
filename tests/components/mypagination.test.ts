// ===== 组件交互测试：MyPagination =====
// 验证对 el-pagination 的封装是否正确转发 props 与事件：
// - 渲染 el-pagination 并透传 total/page/pageSize
// - 页码变化 → 触发 update:page + change
// - 每页条数变化 → 触发 update:pageSize + 重置 page 为 1 + change
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElPagination } from 'element-plus'
import MyPagination from '../../src/components/MyPagination.vue'

describe('MyPagination', () => {
  it('渲染 el-pagination 并透传 total/page/pageSize props', () => {
    const wrapper = mount(MyPagination, {
      props: { total: 50, page: 2, pageSize: 10 },
    })
    const pagination = wrapper.findComponent(ElPagination)

    expect(pagination.exists()).toBe(true)
    // 透传到 el-pagination 的 props（注意 currentPage 的命名）
    expect(pagination.props('total')).toBe(50)
    expect(pagination.props('currentPage')).toBe(2)
    expect(pagination.props('pageSize')).toBe(10)
    // 固定分页选项与布局
    expect(pagination.props('pageSizes')).toEqual([5, 10, 20])
    expect(pagination.props('background')).toBe(true)
  })

  it('页码变化：emit update:page 和 change', async () => {
    const wrapper = mount(MyPagination, {
      props: { total: 100, page: 1, pageSize: 10 },
    })
    const pagination = wrapper.findComponent(ElPagination)

    // 模拟 el-pagination 触发页码变化
    await pagination.vm.$emit('current-change', 3)

    expect(wrapper.emitted('update:page')).toBeTruthy()
    expect(wrapper.emitted('update:page')![0]).toEqual([3])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('每页条数变化：emit update:pageSize、重置 page 为 1 并触发 change', async () => {
    const wrapper = mount(MyPagination, {
      props: { total: 100, page: 3, pageSize: 10 },
    })
    const pagination = wrapper.findComponent(ElPagination)

    // 模拟 el-pagination 触发每页条数变化
    await pagination.vm.$emit('size-change', 20)

    expect(wrapper.emitted('update:pageSize')).toBeTruthy()
    expect(wrapper.emitted('update:pageSize')![0]).toEqual([20])
    // pageSize 变化时强制回到第 1 页
    expect(wrapper.emitted('update:page')![0]).toEqual([1])
    expect(wrapper.emitted('change')).toBeTruthy()
  })
})