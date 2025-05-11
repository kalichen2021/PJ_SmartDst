

export interface TP_entryConf {
  name?: string
  animate: string
  clickHandler: (e?: MouseEvent) => void
}

export type itemOrArray<T> = T | Array<T>

export interface ParticleNumAttr {
  x?: number
  y?: number
  radius?: number
  dx?: number
  dy?: number
  dr?: number
}

export type SetNumAttrOption<T> = {
  [key in keyof T]: number;
} & {
  duration: number;
  // dT: number;
  re?: boolean
  easing?: (t: number) => number;
}

export interface _SetNumAttrOption<T> {
  attr: keyof T
  value: number
  duration: number
  dT: number
  easing?: (t: number) => number

}

export interface CanvasItem {
  x: number
  y: number
  radius: number
  color: string
  dx: number
  dy: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  draw: () => void
}

export type isKeyOf<T, K> = K extends keyof T ? true : false;