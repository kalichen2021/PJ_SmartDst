import { type Reactive, reactive, type Ref, ref, toRef, triggerRef, unref, type UnwrapRef } from "vue";
import type { Circle, itemOrArray, Point, Polygon, Rect } from "./type";




export const getRandom = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const toArray = <T>(i: itemOrArray<T>): T[] => {
  if (Array.isArray(i)) return i
  return [i];
}

/**
 * 创建联动响应式状态对象
 * @template T 状态对象类型，应包含字符串键和任意值类型
 * @param config 配置对象，包含两种类型的属性：
 *               - 主动变量：直接赋值的基础值
 *               - 从动变量：接收依赖参数并返回计算值的函数
 * 
 * @returns 返回包含以下内容的对象：
 *          - 所有状态的响应式访问器
 *          - update方法：用于批量更新主动变量
 * 
 * @example
 * const state = createLinkedState({
 *   width: 100,
 *   height: 50,
 *   area: ({ width, height }) => width * height,
 *   ratio: ({ width, height }) => width / height
 * });
 * 
 * state.update({ width: 200, height: 100 });
 * // 也可以直接修改
 * console.log(state.area);  // 20000
 * console.log(state.ratio); // 2
 */
export const createLinkedState = <T extends Record<string, any>>(
  config: {
    [K in keyof T]: T[K] | ((deps: Omit<T, K>) => T[K])
  },
  callBack: (state: any) => void = () => null
) => {
  const activeKeys = Object.keys(config).filter(k => typeof config[k] !== 'function');
  const drivenKeys = Object.keys(config).filter(k => typeof config[k] === 'function');

  // 为所有主动变量创建ref
  const activeRefs = activeKeys.reduce((acc, k) => {
    acc[k] = ref(config[k]);
    return acc;
  }, {} as Record<string, Ref<any>>);

  // 为所有从动变量创建ref
  const state = reactive<{ [K in keyof T]: T[K] }>({} as any);

  // 定义主动变量访问器
  activeKeys.forEach(k => {
    Object.defineProperty(state, k, {
      get: () => activeRefs[k].value,
      set: (val) => {
        activeRefs[k].value = val;
        triggerRef(activeRefs[k]);
      }
    });
  });

  // 定义从动变量访问器
  drivenKeys.forEach(k => {
    const driveFunc = config[k] as (deps: any) => T[typeof k];
    Object.defineProperty(state, k, {
      get: () => {
        // 直接访问states及所有变量，包括从动变量。
        return driveFunc(state);
      },
      set: () => {
        throw new Error(`请通过 update 方法修改主动变量`);
      }
    });
  });

  const update = (newVals: Partial<typeof activeRefs>) => {
    Object.entries(newVals).forEach(([k, v]) => {
      if (activeRefs[k]) {
        activeRefs[k].value = v;
        triggerRef(activeRefs[k]);
      }
    });
  };

  const debug = () => {
    console.log('当前存储状态：')
    // 打印主动变量
    activeKeys.forEach(k => {
      console.log(`主动变量 ${k}:`, activeRefs[k].value)
    })
    // 打印从动变量
    drivenKeys.forEach(k => {
      console.log(`从动变量 ${k}:`, (state as any)[k as keyof T])
    })
  }

  callBack(state)
  return Object.assign(state, { update, debug });
}


export const getCookie = (name: string) => {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

export const setCookie = (name: string, value: string | number, days: number = 365) => {
  const expires = new Date(Date.now() + days * 864e+5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}


//#region  Geometry
export const getD = (axis0: Point, axis1?: Point) => {
  if (!axis1) {
    axis1 = axis0.map((val) => 0) as Point;
  }
  return Math.sqrt(
    axis0.reduce((sum, val, i) => sum + Math.pow(axis1[i] - val, 2), 0)
  );
}

export const rectToPolygon = (rect: Rect): Polygon => {
  const { x, y, width, height } = rect;
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}

export const isPointInPolygon = (
  point: Point,
  polygon: Polygon,
  precision: number = 0,
): boolean => {
  if (polygon.length < 3) {
    throw new Error("A polygon must have at least 3 points.");
  }

  let isInside: boolean = false;
  const [x, y]: [number, number] = point;

  for (let i: number = 0, j: number = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi]: [number, number] = polygon[i];
    const [xj, yj]: [number, number] = polygon[j];

    const intersect: boolean =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
};

export const isPolygonInPolygon = (
  polygon1: Polygon,
  polygon2: Polygon,
  precision: number = 0,
) => {
  return polygon1.every((point) => isPointInPolygon(point, polygon2, precision));
}

export const isInCircle = (
  circle: Circle,
  point: Point,
  precision: number = 0,
): boolean => {
  const [cx, cy]: [number, number] = circle.center;
  const r: number = circle.radius;
  const d: number = getD([cx, cy], point);
  return d <= r + precision;
}
// #endregion


//#region 性能优化
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
// #endregion

// 获得css根变量
export const getCssVal = (valName: string) => {
  const root = document.documentElement;
  const cssVar = getComputedStyle(root);
  return cssVar.getPropertyValue(valName).trim();

}


export const isInDom = (el: HTMLElement, parent: HTMLElement): boolean => {
  if (el === parent) {
    return true;
  }
  if (el.parentNode === null) {
    return false;
  }
  return el.parentElement !== null && isInDom(el.parentElement, parent);
}

// 获得带有margin的元素位置
// 参考：https://stackoverflow.com/questions/19595189/getboundingclientrect-with-margin
export const getBoundingRectWithMargin = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  const marginLeft = parseFloat(style.marginLeft) || 0;
  const marginRight = parseFloat(style.marginRight) || 0;
  console.log({ rect, marginTop, marginBottom, marginLeft, marginRight });

  return {
    top: rect.top - marginTop,
    bottom: rect.bottom + marginBottom,
    left: rect.left - marginLeft,
    right: rect.right + marginRight,
    width: rect.width + marginLeft + marginRight,
    height: rect.height + marginTop + marginBottom,
  };
}


const customStorage: { hideCallback?: Function } = {};
/**
 * 点击空白位置，隐藏控件
 * @param willHiddenElement 需要隐藏的元素组, mousedown事件的e.target将会排除这些元素及其子元素, mousedown事件后隐藏
 * @param excludeElementGrp 需要排除的元素组, mousedown事件的e.target将会排除这些元素及其子元素
 * @param hideCallback 隐藏后的回调函数，mousedown事件触发
 * @param isVisibleVal 需要隐藏的元素组的显示状态（ref响应式变量）, mousedown事件赋值为false
 */
export const clickSwhToHide = (
  willHiddenElement: itemOrArray<HTMLElement>,
  excludeElementGrp: itemOrArray<HTMLElement> = [],
  hideCallback?: Function,
) => {
  // tips：ts 类型断言，会影响整个文件的类型推导
  excludeElementGrp = toArray(excludeElementGrp);
  willHiddenElement = toArray(willHiddenElement);
  customStorage.hideCallback = hideCallback;

  const _isExcludeEl = (targetEl: HTMLElement): boolean => {
    // tips: 使用return时注意多层嵌套
    let _r = false;
    [...excludeElementGrp, ...willHiddenElement].forEach((el) => {
      // if (isInDom(targetEl, el)) return true;;
      if (isInDom(targetEl, el)) {
        _r = true;
        return;
      };
    })
    return _r;
  };

  const _hide = (e: MouseEvent) => {
    if (_isExcludeEl(e.target as HTMLElement)) {
      return;
    }
    document.removeEventListener("mousedown", _hide);
    [...willHiddenElement].forEach((el) => (el.style.display = "none"));
    customStorage.hideCallback?.();
  };
  document.addEventListener("mousedown", _hide);
};

export const logPerformance = (label: string): void => {
  console.time(label);
  // 执行需要监控的代码
  console.timeEnd(label);
}
