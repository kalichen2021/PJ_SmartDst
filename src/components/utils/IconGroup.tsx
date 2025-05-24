import type { Point } from '@/assets/js/type'
import { h, render, type Ref } from 'vue'

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

export class DragHandler {
  /** 操作对象 */
  targetEl: HTMLElement

  /** 鼠标初始x坐标 */
  startX: number = 0

  /** 鼠标初始y坐标 */
  startY: number = 0

  /** 鼠标当前相对x坐标 */
  curRelX: number = 0

  /** 鼠标当前相对y坐标 */
  curRelY: number = 0

  isDragging: boolean = false
  animationFrameId: number | null = null

  constructor(el: HTMLElement) {
    this.targetEl = el

    // this.targetEl.addEventListener('mousedown', this.start.bind(this))
  }
  apply(e: MouseEvent) {
    // 绑定事件
    this._start(e)
    this.targetEl.style.userSelect = 'none'
  }

  _start(e: MouseEvent) {
    e.preventDefault()
    // 设置鼠标形状
    document.body.style.cursor = 'grabbing'
    this.isDragging = true
    this.startX = e.clientX
    this.startY = e.clientY

    // 动态绑定事件
    document.addEventListener('mousemove', this._process.bind(this))
    document.addEventListener('mouseup', this._stop.bind(this))

    console.log('Drag started')
  }

  _process(e: MouseEvent) {
    if (!this.isDragging) return

    e.preventDefault()
    this.curRelX = e.clientX - this.startX
    this.curRelY = e.clientY - this.startY

    // 使用 requestAnimationFrame 优化 DOM 更新
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(() => {
        this._processInnerFunc()
        this.animationFrameId = null
      })
    }
  }

  _processInnerFunc() {
    null
  }

  _stop(e: MouseEvent) {
    if (!this.isDragging) return
    e.preventDefault()
    this.isDragging = false
    // 设置鼠标形状
    document.body.style.cursor = ''
    this.targetEl.style.userSelect = 'auto'

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

export class MagneticTransitionHandler extends DragHandler {
  interval: { x: number; y: number }
  _startFnCallback: () => void
  _processFnCallback: () => void
  _stopFnCallback: () => void

  constructor(
    el: HTMLElement,
    interval?: { x: number; y: number },
    _startFnCallback?: () => void,
    _processFnCallback?: () => void,
    _stopFnCallback?: () => void,
  ) {
    super(el)
    this.interval = interval ?? { x: 0, y: 0 }
    this._startFnCallback = _startFnCallback ?? (() => {})
    this._processFnCallback = _processFnCallback ?? (() => {})
    this._stopFnCallback = _stopFnCallback ?? (() => {})
  }

  getFixedSize(_x: number, _y: number): { x: number; y: number } {
    return {
      x: Math.round(_x / this.interval.x) * this.interval.x,
      y: Math.round(_y / this.interval.y) * this.interval.y,
    }
  }

  _start(e: MouseEvent): void {
    super._start(e)
    this._startFnCallback()
  }

  _stop(e: MouseEvent): void {
    super._stop(e)
    this._stopFnCallback()
  }
}

export class MoveHandler extends MagneticTransitionHandler {
  curPosition: Point
  updateInterval: number | null = null
  constructor(
    el: HTMLElement,
    interval?: {
      x: number
      y: number
    },
    _startFnCallback?: () => void,
    _processFnCallback?: () => void,
    _stopFnCallback?: () => void,
  ) {
    super(el, interval, _startFnCallback, _processFnCallback, _stopFnCallback)
    this.curPosition = [0, 0]
    this.updateInterval = null
  }

  private get targetElAxis() {
    // const x0 = parseInt(this.targetEl.style.left || '0', 10) || 0
    // const y0 = parseInt(this.targetEl.style.top || '0', 10) || 0
    const transform = this.targetEl.style.transform || 'translate(0px, 0px)'
    const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
    const x0 = match ? parseFloat(match[1]) : 0
    const y0 = match ? parseFloat(match[2]) : 0

    return { x0, y0 }
  }
  _start(e: MouseEvent): void {
    super._start(e)
    this.startX -= this.targetElAxis.x0
    this.startY -= this.targetElAxis.y0
    this.updateInterval = setInterval(() => {
      this._processInnerFunc()
    }, 100) // 每100ms更新一次
  }

  _processInnerFunc(): void {
    // this.targetEl.style.left = `${this.curRelX}px`
    // this.targetEl.style.top = `${this.curRelY}px`
    // 使用 transform 替代 left 和 top
    const { x, y } = this.getFixedSize(this.curRelX, this.curRelY)
    this.curPosition = [x, y]
    this.targetEl.style.transform = `translate(${x}px, ${y}px)`
    this._processFnCallback()
  }

  _stop(e: MouseEvent): void {
    super._stop(e)
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }
}

export class ScaleHandler extends MagneticTransitionHandler {
  elStartWidth: number
  elStartHeight: number
  curSize: Point

  constructor(
    el: HTMLElement,
    interval: { x: number; y: number },
    _startFnCallback?: () => void,
    _processFnCallback?: () => void,
    _stopFnCallback?: () => void,
  ) {
    super(el, interval, _startFnCallback, _processFnCallback, _stopFnCallback)
    this.elStartWidth = this.targetEl.offsetWidth
    this.elStartHeight = this.targetEl.offsetHeight
    this.curSize = [3, 3]
  }

  _processInnerFunc() {
    const { x, y } = this.getFixedSize(
      this.elStartWidth + this.curRelX,
      this.elStartHeight + this.curRelY,
    )
    this.curSize = [Math.floor(x / this.interval.x), Math.round(y / this.interval.y)]
    this.targetEl.style.width = `${x + 0.001}px`
    this.targetEl.style.height = `${y + 0.001}px`

    this._processFnCallback()
    // console.log(this.scaleAxis.dx)
  }
}
