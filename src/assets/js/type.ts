

export interface TP_entryConf {
  name?: string
  animate: string
  clickHandler: (e?: MouseEvent) => void
}

export type itemOrArray<T> = T | Array<T>