

export interface TP_entryConf {
  name?: string
  animate: string
  clickHandler: (e?: MouseEvent) => void
}

export type UserOperaState = "IDLE" | "EDITING" | "EDIT_DRAG" | "EDIT_SCALE" | "EDIT_INTERSECT" | "INTERSECTED";

export type itemOrArray<T> = T | Array<T>

export type AniNumVal = `+${number}` | `-${number}` | number

export interface ParticleNumAttr<T = number> {
  x?: T
  y?: T
  radius?: T
  dx?: T
  dy?: T
  dr?: T
}


export type AniOptionsAttr = {
  duration: number;
  // dT: number;
  re?: boolean
  easing?: (t: number) => number;
}

// export type appGroupClass = Array<{
//   name: string,
//   appGroupPosition: Point,
//   appGroupSize: Point,
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


// 判断某个键是否是只读的
export type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];

// 排除只读属性后的类型
export type ExcludeReadonly<T> = Pick<T, WritableKeys<T>>
