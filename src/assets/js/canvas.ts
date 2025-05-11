import type { CanvasItem, SetNumAttrOption, isKeyOf, ParticleNumAttr } from "./type.ts";
import { getRandom } from "./utils.ts";



class canvasInfo {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement = document.getElementById("back-media") as HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

}


export class canvasOperator extends canvasInfo {
  items: Array<CanvasItem | CanvasItem[]> | null
  constructor(
    canvas: HTMLCanvasElement | undefined = undefined
  ) {
    super(canvas)
    this.items = null
  }
  init(
    option = {
      dynamicResize: true
    }
  ) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // this.ctx.scale(devicePixelRatio, devicePixelRatio);
    // this.clear();
    window.addEventListener("resize", () => {
      this.init();
    });
  }

  _process(objArray: CanvasItem[], ...update: ((objArray: CanvasItem[]) => void)[]) {
    for (const _update of update) {
      _update(objArray)
    }
    this.draw(objArray)
    requestAnimationFrame(() => this._process(objArray, ...update));

  }

  __process(drawParam: Array<CanvasItem | CanvasItem[]>, ...update: ((objArray: CanvasItem[]) => void)[]) {
    const _f = () => {
      this.clear();
      this.draw(drawParam);
      requestAnimationFrame(() => _f)
    }
    _f()
  }
  process(drawParam?: Array<CanvasItem | CanvasItem[]>, ...update: ((objArray: CanvasItem[]) => void)[]) {
    const _f = () => {
      const param = drawParam ? drawParam : this.items
      if (param) {
        this.clear();
        this.draw(param);
      } else {
      }
      requestAnimationFrame(() => _f())
    }
    _f()
  }

  draw(objArray: Array<CanvasItem | CanvasItem[]>) {
    // this.clear();
    for (const obj of objArray) {
      if (Array.isArray(obj)) {
        this.draw(obj);
      } else {
        obj.draw();
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addItem<T extends CanvasItem>(Items: Array<T | T[]>) {
    this.items = Items
  }

  getItem<T extends CanvasItem>(col: number, row: number): T | undefined {
    if (this.items) {
      if (!Array.isArray(this.items[0])) {
        // this.items = [this.items] as Array<CanvasItem[]>;
        // row = col
        // col = 0;
        return this.items[col] as T;
      } else {
        return (this.items[col] as T[])[row]
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

  constructor({
    x,
    y,
    radius = getRandom(1 * devicePixelRatio, 3 * devicePixelRatio), // 默认值
    color = "black", // 默认值
    dx = 0, // 默认值
    dy = 0, // 默认值
    dr = 0, // 默认值
    isAni = false
  }: ParticleNumAttr & {
    color: string
    isAni?: boolean
  }) {
    super()
    this.x = x ?? Math.random() * this.canvas.width;
    this.y = y ?? Math.random() * this.canvas.height;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.dr = dr;
    this.isAni = isAni;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  moveTo(x1: number, y1: number, duration: number = 500) {
    const
      x0 = this.x,
      y0 = this.y,
      dx = (x1 - x0) / duration,
      dy = (y1 - y0) / duration,
      t0 = Date.now();

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
    }
    _move();
    //   // Check for collision with canvas boundaries
    //   if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
    //     this.dx = -this.dx;
    //   }
    //   if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
    //     this.dy = -this.dy;
    //   }
  }

  animate(...options: SetNumAttrOption<ParticleNumAttr>[]) {
    const _pna: ParticleNumAttr = {
      x: 0,
      y: 0,
      radius: 0,
      dx: 0,
      dy: 0,
      dr: 0,
    }

    const _setAttr = (
      option: {
        key: keyof ParticleNumAttr
        value: number
        duration: number
        // dT: number
      }
    ) => {
      const
        startAttr = this[option.key],
        endAttr = option.value,
        t0 = Date.now()
      const dT = (endAttr - startAttr) / option.duration

      const _process = () => {
        const dt = Date.now() - t0;
        this[option.key] = startAttr + dT * dt;
        // console.log(option.key)
        if (dt >= option.duration) {
          this[option.key] = endAttr;
          this.isAni = false
          return;
        }
        requestAnimationFrame(_process);
      }
      _process();
    }
    for (const option of options) {
      let _key, _value
      for (const key in option) {
        if (key in _pna) {
          _key = key as keyof ParticleNumAttr
          _value = option[_key]
        }
      }
      console.log(this.isAni)
      if (!this.isAni) {
        this.isAni = true
        _setAttr({
          key: _key!,
          value: _value!,
          duration: option.duration,
          // dT: option.dT,
        })
      }

    }


  }
}