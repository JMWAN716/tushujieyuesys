// 轻量全局 toast 提示：动态插入 DOM 元素，避免浏览器拦截 alert 弹窗
// 支持 success / error 两种类型，3 秒后自动消失
export function showToast(message, type = 'error') {
  // 若已存在 toast 容器则复用，否则创建
  let box = document.querySelector('.toast-box')
  if (!box) {
    box = document.createElement('div')
    box.className = 'toast-box'
    document.body.appendChild(box)
    // 一次性注入 toast 容器样式
    const style = document.createElement('style')
    style.textContent = `
      .toast-box { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
      .toast-item { padding: 10px 20px; border-radius: 8px; color: #fff; font-size: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); animation: toast-in 0.3s ease; }
      .toast-item.success { background: #67c23a; }
      .toast-item.error { background: #f56c6c; }
      @keyframes toast-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `
    document.head.appendChild(style)
  }

  // 创建本次提示条目
  const el = document.createElement('div')
  el.className = 'toast-item ' + type
  el.textContent = message
  box.appendChild(el)

  // 3 秒后淡出并移除
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s'
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 300)
  }, 3000)
}