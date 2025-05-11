import { h, render, type Ref } from 'vue'

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

export class dragHandler {
  /** 操作对象 */
  targetEl: HTMLElement

  /** 鼠标的初始x坐标 */
  startX: number = 0

  /** 鼠标的初始y坐标 */
  startY: number = 0

  /** 鼠标的当前相对x坐标 */
  curRelX: number = 0

  /** 鼠标的当前相对y坐标 */
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
  }

  _start(e: MouseEvent) {
    e.preventDefault()
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
  _start(e: MouseEvent): void {
    super._start(e)
    this.startX -= this.targetElAxis.x0
    this.startY -= this.targetElAxis.y0
  }

  _processInnerFunc(): void {
    // this.targetEl.style.left = `${this.curRelX}px`
    // this.targetEl.style.top = `${this.curRelY}px`
    // 使用 transform 替代 left 和 top
    console.log(this.curRelX)
    this.targetEl.style.transform = `translate(${this.curRelX}px, ${this.curRelY}px)`
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

  test() {
    console.log(this)
  }
}

export class scaleHandler extends dragHandler {
  elStartWidth: number
  elStartHeight: number
  unitSize: { width: number; height: number }
  _startFnCallback: () => void
  _stopFnCallback: () => void

  constructor(
    el: HTMLElement,
    unitSize: { width: number; height: number },
    _startFnCallback: () => void,
    _stoptFnCallback: () => void,
  ) {
    super(el)
    this.elStartWidth = this.targetEl.offsetWidth
    this.elStartHeight = this.targetEl.offsetHeight
    this.unitSize = unitSize
    this._startFnCallback = _startFnCallback
    this._stopFnCallback = _stoptFnCallback
  }
  private getFixedSize(curWidth: number, curHeight: number) {
    // mutiple width and height, 单位长度
    const unitWidth = this.unitSize.width
    const unitHeight = this.unitSize.height
    const mult_w = Math.floor(curWidth / unitWidth) * unitWidth || unitWidth
    const mult_h = Math.floor(curHeight / unitHeight) * unitHeight || unitHeight
    return { mult_w, mult_h }
  }

  _start(e: MouseEvent): void {
    super._start(e)
    this._startFnCallback()
  }

  _processInnerFunc() {
    const fixedSize = this.getFixedSize(
      this.elStartWidth + this.curRelX,
      this.elStartHeight + this.curRelY,
    )
    this.targetEl.style.width = `${fixedSize.mult_w}px`
    this.targetEl.style.height = `${fixedSize.mult_h}px`
    // console.log(this.scaleAxis.dx)
  }

  _stop(e: MouseEvent): void {
    super._stop(e)
    this._stopFnCallback()
  }

  test() {
    console.log(this.targetEl)
  }
}
