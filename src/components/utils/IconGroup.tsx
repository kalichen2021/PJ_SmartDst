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

const _mUpHandler = (e: MouseEvent) => {}

export function _dragHandler(e: MouseEvent, el: HTMLElement) {
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

export class dragHandler {
  targetEl: HTMLElement
  startX: number = 0
  startY: number = 0

  constructor(el: HTMLElement) {
    this.targetEl = el
  }

  start(e: DragEvent) {
    // const originAxis = this.targetEl.getBoundingClientRect()
    this.startX = e.clientX
    this.startY = e.clientY

    // this.targetEl!.style.left = ''
    // this.targetEl!.style.top = ''

    // e.dataTransfer!.setData('text/plain', e.target!.id)
    // 创建透明占位元素, 避免拖动时出现默认的占位效果
    const ghost = document.createElement('div')
    ghost.style.opacity = '0'
    e.dataTransfer!.setDragImage(ghost, 0, 0)
    e.dataTransfer!.effectAllowed = 'move'
    console.log(`Drag started at (${this.startX}, ${this.startY})`)
  }

  process(e: DragEvent) {
    e.preventDefault()
    const deltaX = e.clientX - this.startX
    const deltaY = e.clientY - this.startY
    this.targetEl!.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    console.log(`Element moved to (${deltaX}, ${deltaY})`)
  }

  over(e: DragEvent) {
    e.preventDefault()
  }

  enter(e: DragEvent) {
    // console.log(`Drag entered ${e.target.id} area`)
  }

  drop(e: DragEvent) {
    e.preventDefault()
    const finalX = e.clientX - this.startX
    const finalY = e.clientY - this.startY
    // this.targetEl!.style.transform = `translate(${finalX}px, ${finalY}px)`
    // console.log(`Drag dropped at (${finalX}, ${finalY})`)
    // 若之前移动过，则加上当前的偏移量
    const curLeft = +this.targetEl.style.left.replace('px', '')
    const curtop = +this.targetEl.style.top.replace('px', '')
    this.targetEl!.style.left = `${finalX + curLeft}px`
    this.targetEl!.style.top = `${finalY + curtop}px`
    this.targetEl!.style.transform = ''
  }
}
