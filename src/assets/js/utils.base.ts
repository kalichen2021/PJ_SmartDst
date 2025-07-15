import type { itemOrArray } from "./type";

export const getRandom = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const toArray = <T>(i: itemOrArray<T>): T[] => {
  if (Array.isArray(i)) return i
  return [i];
}