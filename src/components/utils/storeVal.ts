import { getCookie, setCookie } from "@/assets/js/utils";

export const setIntervalXY = ({ x, y }: { x: number, y: number }) => {
  // 设置interval值到cookie中
  setCookie('intervalX', x, 365);
  setCookie('intervalY', y, 365);
}

export const getIntervalXY = () => {
  return {
    x: parseFloat(getCookie('intervalX')),
    y: parseFloat(getCookie('intervalY'))
  }
}
