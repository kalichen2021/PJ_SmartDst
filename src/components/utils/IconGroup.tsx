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

export class dragHandler {
  targetEl: HTMLElement
  startX: number = 0
  startY: number = 0
  isDragging: boolean = false
  animationFrameId: number | null = null
  currentX: number = 0
  currentY: number = 0

  constructor(el: HTMLElement) {
    this.targetEl = el

    // this.targetEl.addEventListener('mousedown', this.start.bind(this))
  }
  apply(e: MouseEvent) {
    // 绑定事件
    this._start(e)
  }

  _start(e: MouseEvent) {
    e.preventDefault()
    this.isDragging = true
    this.startX = e.clientX - (parseInt(this.targetEl.style.left || '0', 10) || 0)
    this.startY = e.clientY - (parseInt(this.targetEl.style.top || '0', 10) || 0)

    // 动态绑定事件
    document.addEventListener('mousemove', this._process.bind(this))
    document.addEventListener('mouseup', this._stop.bind(this))

    console.log('Drag started')
  }

  _process(e: MouseEvent) {
    if (!this.isDragging) return

    e.preventDefault()
    this.currentX = e.clientX - this.startX
    this.currentY = e.clientY - this.startY

    // 使用 requestAnimationFrame 优化 DOM 更新
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.targetEl.style.left = `${this.currentX}px`
        this.targetEl.style.top = `${this.currentY}px`
        console.log(`Dragging: (${this.currentX}, ${this.currentY})`)
        this.animationFrameId = null
      })
    }
  }

  _stop(e: MouseEvent) {
    if (!this.isDragging) return

    e.preventDefault()
    this.isDragging = false

    // 动态移除事件
    document.removeEventListener('mousemove', this._process.bind(this))
    document.removeEventListener('mouseup', this._stop.bind(this))

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    console.log('Drag stopped')
  }
}

export class moveHandler extends dragHandler {
  constructor(el: HTMLElement) {
    super(el)
  }

  test() {
    console.log(this)
  }
}

export class scaleHandler extends dragHandler {
  constructor(el: HTMLElement) {
    super(el)
  }

  test() {
    console.log(this.targetEl)
  }
}
