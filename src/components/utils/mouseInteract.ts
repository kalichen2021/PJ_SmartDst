import type { Point, Polygon } from '@/assets/js/type'
import { rectToPolygon, throttle } from '@/assets/js/utils'
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
    this._processInnerFunc()

    // console.log('Drag started')
  }

  _process(e: MouseEvent) {
    throttle(() => {
      if (!this.isDragging) return
      e.preventDefault()
      this.curRelX = e.clientX - this.startX
      this.curRelY = e.clientY - this.startY
    }, 16)()
  }

  // get curRelX() return e.clientX - this.startX

  _processInnerFunc() {
    // 使用 requestAnimationFrame 优化 DOM 更新
    cancelAnimationFrame(this.animationFrameId!)
    this.animationFrameId = requestAnimationFrame(() => {
      this._processInnerFunc()
    })
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

    // 重置相关参数
    this.curRelX = 0
    this.curRelY = 0
    this.startX = 0
    this.startY = 0

    // console.log('Drag stopped')
  }
}

export class MagneticTransitionHandler extends DragHandler {
  interval: { x: number; y: number }
  _startFnCallback: () => void
  _processFnCallback: () => void
  _stopFnCallback: () => void

  constructor(
    el: HTMLElement,
    options: {
      interval?: { x: number; y: number }
      _startFnCallback?: () => void
      _processFnCallback?: () => void
      _stopFnCallback?: () => void
    } = {},
  ) {
    super(el)
    const { interval, _startFnCallback, _processFnCallback, _stopFnCallback } = options
    this.interval = interval ?? { x: 0, y: 0 }
    this._startFnCallback = _startFnCallback ?? (() => { })
    this._processFnCallback = _processFnCallback ?? (() => { })
    this._stopFnCallback = _stopFnCallback ?? (() => { })
  }
  /**
   * 获得最近的固定点
   * @param _x - x坐标
   * @param _y - y坐标
   * @returns 最近的固定点
   */
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

  _processInnerFunc(): void {
    this._processFnCallback()
    super._processInnerFunc() // 调用父类的 _processInnerFunc 方法，实现动画效果
  }

  _stop(e: MouseEvent): void {
    if (!this.isDragging) return
    super._stop(e)
    this._stopFnCallback()
  }
}

export class MoveHandler extends MagneticTransitionHandler {
  curPosition: Point
  ElStartX: number = 0
  ElStartY: number = 0
  constructor(
    el: HTMLElement,
    options: {
      interval?: { x: number; y: number }
      _startFnCallback?: () => void
      _processFnCallback?: () => void
      _stopFnCallback?: () => void
    } = {},
  ) {
    super(el, options)
    this.curPosition = [0, 0]
  }

  /**
   * 获得目标元素的初始位置
   * @returns 目标元素的初始位置
   */
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
    // tips: 小心监听器。还有整个函数的过程，它可能会让你刚改完的值右窜改成其他值。
    // 所以要先把值存起来，然后再用。
    this.ElStartX = this.targetElAxis.x0
    this.ElStartY = this.targetElAxis.y0
    super._start(e)
    // this.updateInterval = setInterval(() => {
    //   this._processInnerFunc()
    // }, 100) // 每100ms更新一次
    // console.log(this.startX)
  }

  _processInnerFunc(): void {
    // this.targetEl.style.left = `${this.curRelX}px`
    // this.targetEl.style.top = `${this.curRelY}px`
    // 使用 transform 替代 left 和 top
    const { x, y } = this.getFixedSize(this.curRelX + this.ElStartX, this.curRelY + this.ElStartY)
    this.curPosition = [x / this.interval.x, y / this.interval.y]
    this.targetEl.style.transform = `translate(${x}px, ${y}px)`
    super._processInnerFunc()
  }
}

export class ScaleHandler extends MagneticTransitionHandler {
  elStartWidth: number
  elStartHeight: number
  curSize: Point
  maxSize: Point

  constructor(
    el: HTMLElement,
    option: {
      interval: { x: number; y: number }
      _startFnCallback?: () => void
      _processFnCallback?: () => void
      _stopFnCallback?: () => void
      maxSize?: Point
    },
  ) {
    super(el, option)
    this.elStartWidth = 0
    this.elStartHeight = 0
    this.curSize = [0, 0]
    this.maxSize = option.maxSize ?? [3, 3]
  }

  getFixedSize(_x: number, _y: number): { x: number; y: number } {
    _x = Math.max(_x, 0) // 限制最小宽度为 0
    _y = Math.max(_y, 0) // 限制最小高度为 0
    if (this.maxSize) {
      _x = Math.min(_x, this.maxSize[0] * this.interval.x) // 限制最大宽度为 maxSize[0] * interval.x
      _y = Math.min(_y, this.maxSize[1] * this.interval.y) // 限制最大高度为 maxSize[1] * interval.y
    }
    return super.getFixedSize(_x, _y) // 调用父类的 getFixedSize 方法，实现缩放效果
  }

  _start(e: MouseEvent): void {
    this.elStartWidth = this.targetEl.offsetWidth
    this.elStartHeight = this.targetEl.offsetHeight
    super._start(e)
  }

  _processInnerFunc() {
    const { x, y } = this.getFixedSize(
      this.elStartWidth + this.curRelX,
      this.elStartHeight + this.curRelY,
    )
    this.curSize = [Math.floor(x / this.interval.x), Math.round(y / this.interval.y)]
    this.targetEl.style.width = `${x + 0.001}px`
    this.targetEl.style.height = `${y + 0.001}px`
    super._processInnerFunc()
  }
}

export class SelectFrameHandler extends MagneticTransitionHandler {
  curSize: Point
  selectRange: Polygon
  curStartX: number = 0
  curStartY: number = 0
  dragable: boolean = false
  constructor(
    el: HTMLElement,
    options: {
      interval?: { x: number; y: number }
      _startFnCallback?: () => void
      _processFnCallback?: () => void
      _stopFnCallback?: () => void
    } = {},
  ) {
    super(el, options)
    this.curSize = [0, 0]
    this.selectRange = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ]
    this.dragable = false
  }
  _start(e: MouseEvent): void {
    if (!this.dragable) return
    this.targetEl.removeAttribute('style')
    super._start(e)
    this.curStartX = this.startX
    this.curStartY = this.startY
    this.targetEl.style.transform = `translate(${this.curStartX}px, ${this.curStartY}px)`
  }
  _processInnerFunc(): void {
    // const { x: curWidth, y: curHeight } = this.getFixedSize(this.curRelX, this.curRelY)
    const { x: curWidth, y: curHeight } = { x: Math.abs(this.curRelX), y: Math.abs(this.curRelY) }
    this.curStartX = this.curRelX < 0 ? this.startX - curWidth : this.startX
    this.curStartY = this.curRelY < 0 ? this.startY - curHeight : this.startY
    // 通过改变curStartX来实现万向选择。
    this.targetEl.style.width = `${curWidth}px`
    this.targetEl.style.height = `${curHeight}px`
    this.targetEl.style.transform = `translate(${this.curStartX}px, ${this.curStartY}px)`
    this.selectRange = rectToPolygon({
      x: this.curStartX,
      y: this.curStartY,
      width: curWidth,
      height: curHeight,
    })
    super._processInnerFunc()
  }

  _stop(e: MouseEvent): void {
    super._stop(e)
    this.dragable = false
    this.targetEl.removeAttribute('style')
  }
}
