import type { CanvasItem, SetNumAttrOption, ParticleNumAttr, itemOrArray, AniNumOpt } from "./type.ts";
import { getRandom, toArray } from "./utils.ts";

class canvasInfo {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // 新增性能优化参数
  targetFPS = 60;
  frameInterval = 1000 / 60;
  lastFrameTime = 0;
  batchUpdateQueue = new Set<() => void>();

  // 新增批量更新方法
  batchAnimate(callback: () => void) {
    this.batchUpdateQueue.add(callback);
  }

  // 新增帧率控制方法
  shouldUpdate() {
    const now = Date.now();
    const elapsed = now - this.lastFrameTime;
    return elapsed >= this.frameInterval;
  }

  constructor(canvas: HTMLCanvasElement = document.getElementById("back-media") as HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }
}

export class canvasOperator extends canvasInfo {
  items: Array<CanvasItem | CanvasItem[]> | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    super(canvas);
  }

  /**
   * 初始化画布
   * @param option 配置选项
   */
  init(option = { dynamicResize: true }) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (option.dynamicResize) {
      const resizeHandler = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      window.removeEventListener("resize", resizeHandler); // 避免重复绑定
      window.addEventListener("resize", resizeHandler);
    }
  }

  /**
   * 处理并绘制画布内容
   * @param drawParam 绘制参数
   * @param update 更新函数
   */
  process(drawParam?: Array<CanvasItem | CanvasItem[]>, ...update: ((objArray: CanvasItem[]) => void)[]) {
    const _processFrame = () => {
      if (this.shouldUpdate()) {
        const param = drawParam || this.items;
        if (param) {
          this.clear();
          this.draw(param);
          this.batchUpdateQueue.forEach(fn => fn());
          this.batchUpdateQueue.clear();
          for (const updater of update) {
            updater(param as CanvasItem[]);
          }
        }
        this.lastFrameTime = Date.now();
      }
      requestAnimationFrame(_processFrame);
    };
    _processFrame();
  }

  /**
   * 绘制画布内容
   * @param objArray 画布对象数组
   */
  draw(objArray: Array<CanvasItem | CanvasItem[]>) {
    for (const obj of objArray) {
      if (Array.isArray(obj)) {
        this.draw(obj);
      } else {
        obj.draw();
      }
    }
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 添加绘制项
   * @param Items 绘制项数组
   */
  addItem<T extends CanvasItem>(Items: Array<T | T[]>) {
    this.items = Items;
  }

  /**
   * 获取指定位置的绘制项
   * @param col 列索引
   * @param row 行索引
   * @returns 绘制项
   */
  getItem<T extends CanvasItem>(col: number, row: number): T | undefined {
    if (this.items) {
      if (!Array.isArray(this.items[0])) {
        return this.items[col] as T;
      } else {
        return (this.items[col] as T[])[row];
      }
    }
  }
}

export class Particle extends canvasInfo {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
  dr: number;
  isAni: boolean;
  _originAttr: Particle | null;
  interval: { x: number, y: number }
  public needUpdate: boolean = false;

  constructor({
    x,
    y,
    radius = getRandom(1 * devicePixelRatio, 3 * devicePixelRatio),
    color = "black",
    dx = 0,
    dy = 0,
    dr = 0,
    isAni = false,
    interval = { x: 0, y: 0 },
  }: ParticleNumAttr & {
    color: string;
    isAni?: boolean;
    interval: { x: number, y: number }
  }) {
    super();
    this.x = x ?? Math.random() * this.canvas.width;
    this.y = y ?? Math.random() * this.canvas.height;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.dr = dr;
    this.isAni = isAni;
    this._originAttr = null;
    this.interval = interval
  }

  private getOriginAttr() {
    this._originAttr = this;
    this.getOriginAttr = () => null;
  }

  /**
   * 绘制粒子
   */
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x * this.interval.x, this.y * this.interval.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * 移动粒子到指定位置
   * @param x1 目标x坐标
   * @param y1 目标y坐标
   * @param duration 持续时间
   */
  moveTo(x1: number, y1: number, duration: number = 500) {
    const x0 = this.x;
    const y0 = this.y;
    const dx = (x1 - x0) / duration;
    const dy = (y1 - y0) / duration;
    const t0 = Date.now();

    const _move = () => {
      const dt = Date.now() - t0;
      this.x = x0 + dx * dt;
      this.y = y0 + dy * dt;
      if (dt >= duration) {
        this.x = x1;
        this.y = y1;
        return;
      }
      requestAnimationFrame(_move);
    };
    _move();
  }

  /**
   * 动画效果
   * @param options 动画选项
   * @param callback 动画完成后的回调
   */
  animate(
    options: itemOrArray<SetNumAttrOption<ParticleNumAttr<AniNumOpt>>>,
    callback?: (curObj: Particle) => void
  ) {
    this.getOriginAttr();
    if (this.isAni) return;

    this.isAni = true;
    options = toArray(options);

    const _setAttr = (key: keyof ParticleNumAttr, endAttr: number, duration: number) => {
      const startAttr = this[key];
      const t0 = Date.now();
      const dT = (endAttr - startAttr) / duration;

      var rafId = 0; // 新增：用于保存rafId
      const _process = () => {
        const dt = Date.now() - t0;
        const progress = Math.min(dt / duration, 1);
        const easedProgress = options[0].easing ? options[0].easing(progress) : progress;
        this[key] = startAttr + (endAttr - startAttr) * easedProgress;
        if (dt >= duration) {
          this[key] = endAttr;
          this.isAni = false;
          callback?.(this);
          cancelAnimationFrame(rafId); // 新增：清理回调
          return;
        }
        rafId = requestAnimationFrame(_process); // 保存rafId
      };
      _process();
    };

    const _getEndAttr = (key: keyof ParticleNumAttr) => {
      if (typeof options[0][key] === "number") {
        return options[0][key] as number;
      } else if (typeof options[0][key] === "string") {
        const _val = options[0][key] as string;
        if (_val.startsWith("+")) {
          return this._originAttr![key] + parseFloat(_val.slice(1));
        } else if (_val.startsWith("-")) {
          return this._originAttr![key] - parseFloat(_val.slice(1));
        }
      }
      return 0;
    }


    for (const option of options) {
      for (const key in option) {
        if (key in this) {
          const _key = key as keyof ParticleNumAttr;
          const _endVal = _getEndAttr(_key)
          _setAttr(_key, _endVal, option.duration);
        }
      }
    }
  }
}