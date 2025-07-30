import type { itemOrArray } from "./type";

export const getRandom = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const toArray = <T>(i: itemOrArray<T>): T[] => {
  if (Array.isArray(i)) return i
  return [i];
}

export const isArrayinArray = <T>(arr: T[], arr2: T[]): boolean => {
  return arr2.every(item => arr.includes(item));
}