import { h, render, type Ref } from 'vue'
import IconMore from '@/components/icons/IconMore.vue'

export function hoverHandler() {}

export function rightClickHandler(
  el: HTMLElement,
  isClicked: Ref<Boolean>,
  isElConf: Ref<Boolean>,
) {
  // elIconMore into el
  isClicked.value = true // 显示
  const elBtnEdit = el.querySelector('.CtnConf')
  elBtnEdit?.addEventListener('mousedown', (e) => {
    isElConf.value = true //可设置状态
    isClicked.value = false //隐藏
  })
}

export function resize(el: HTMLElement) {
  // el.addEventListener("")
}

let startX: number, startY: number, initLeft: number, initTop: number
let drugEl: HTMLElement | null = null
let isDrugging = false

const _mMoveHandler = (e: MouseEvent) => {
  if (isDrugging) {
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    drugEl!.style.left = `${initLeft + moveX}px`
    drugEl!.style.top = `${initTop + moveY}px`
  }
}

export function dragHandler(e: MouseEvent, el: HTMLElement) {
  e.preventDefault()
  startX = e.clientX
  startY = e.clientY
  initLeft = el.getBoundingClientRect().left
  initTop = el.getBoundingClientRect().top
  drugEl = el
  isDrugging = true

  document.addEventListener('mousemove', (e) => _mMoveHandler(e))
  document.addEventListener('mouseup', (e) => _mUpHandler(e))
}
