# 图书借阅管理系统

基于 **Vue 3 + Vite** 的前端图书借阅管理系统，支持登录鉴权、图书列表展示、借阅记录查询。

## 技术栈

- Vue 3（`<script setup>` 语法）
- Vite 构建
- Vue Router 4（路由懒加载、嵌套路由、前置守卫鉴权）
- Pinia（状态管理 + `pinia-plugin-persistedstate` 持久化）
- MSW（Mock Service Worker，模拟接口）

## 功能特性

- 模拟登录 / 退出登录（状态持久化，刷新后登录态保持）
- 路由守卫鉴权（未登录自动跳转登录页）
- 图书列表卡片展示
- 借阅记录表格展示（含状态徽章）
- 响应式布局

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产打包
npm run build

# 预览构建产物
npm run preview
```

## 目录结构

```
src/
├── components/       # 通用组件
├── layouts/          # 布局组件
├── mock/             # MSW mock 接口
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
└── views/            # 页面
```

## 登录说明

本项目为前端演示项目，登录采用模拟方式——在登录页输入任意用户名即可登录进入系统。