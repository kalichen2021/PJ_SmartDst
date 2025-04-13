import { h, render, type Ref } from 'vue'
import IconMore from '@/components/icons/IconMore.vue'

export function hoverHandler() {}

export function rightClickHandler(el: HTMLElement, isElConf: Ref<Boolean>) {
  // elIconMore into el
  const vnode = h(
    'div',
    {
      class: 'GrpCtnConf',
      style: {
        position: 'absolute',
        top: '0',
        right: '-1.5rem',
        width: '1.5rem',
        height: '1.5rem',
      },
    },
    [h(IconMore)],
  ) // 创建虚拟节点
  render(vnode, el) // 渲染到指定的 DOM 元素

  const iconElement = document.querySelector('.GrpCtnConf')
  iconElement?.addEventListener('mousedown', (e) => {
    render(null, el) // Unmount the vnode
    isElConf.value = true //可设置状态
  })
}

export function resize(el: HTMLElement) {
  // el.addEventListener("")
}
