

export interface TP_entryConf {
  name?: string
  animate: string
  clickHandler: (e?: MouseEvent) => void
}

export type itemOrArray<T> = T | Array<T>

export type AniNumOpt = `+${number}` | `-${number}` | number

export interface ParticleNumAttr<T = number> {
  x?: T
  y?: T
  radius?: T
  dx?: T
  dy?: T
  dr?: T
}


export type SetNumAttrOption<T> = T & {
  duration: number;
  // dT: number;
  re?: boolean
  easing?: (t: number) => number;
}

// export type iconGroupClass = Array<{
//   name: string,
//   iconGroupPosition: Point,
//   iconGroupSize: Point,
//   rangePolygon: Polygon,
// }>

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

// export type isKeyOf<T, K> = K extends keyof T ? true : false;

// Geometry
export type Point = [number, number]

export type Circle = {
  center: Point
  radius: number
}

export type Polygon = [Point, Point, ...Point[]]

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

