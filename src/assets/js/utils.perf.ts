

export const logPerformance = (label: string): void => {
  console.time(label);
  // 执行需要监控的代码
  console.timeEnd(label);
}


export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};