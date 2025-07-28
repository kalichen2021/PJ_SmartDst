import { reactive, triggerRef, type Ref, ref, type Reactive } from "vue";



const RESET_COOKIE = false
export const getCookie = (name: string) => {
  if (RESET_COOKIE) {
    // 删除该项cookie
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    return "";
  }
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
  _config: {
    [K in keyof T]: {
      default: T[K] | ((deps: Omit<T, K>) => T[K]),
      callback?: (newVal: T[K]) => void
    } | T[K] | ((deps: Omit<T, K>) => T[K])
  }
): T & { update: () => void; debug: () => void } => {
  // 规范化配置对象类型
  type ConfigItem<K extends keyof T> = {
    default: T[K] | ((deps: Omit<T, K>) => T[K]),
    callback?: (newVal: T[K]) => void
  };

  const normalizedConfig = {} as { [K in keyof T]: ConfigItem<K> };

  // 规范化配置对象
  Object.keys(_config).forEach(<K extends keyof T>(k: K) => {
    const value = _config[k];
    normalizedConfig[k] = (typeof value === 'object' && value !== null && 'default' in value)
      ? value as ConfigItem<K>
      : { default: value } as ConfigItem<K>;
  });

  const state = reactive<T>({} as T);

  // 为所有主动变量创建响应式属性
  Object.keys(normalizedConfig)
    .filter(k => typeof normalizedConfig[k].default !== 'function')
    .forEach(<K extends keyof T>(k: K) => {
      const key = k as K;
      Object.defineProperty(state, key, {
        get: () => normalizedConfig[key].default,
        set: (val: T[K]) => {
          normalizedConfig[key].default = val;
          normalizedConfig[key].callback && normalizedConfig[key].callback(val)
        }
      });
    });

  // 为所有从动变量创建响应式属性
  Object.keys(normalizedConfig)
    .filter(k => typeof normalizedConfig[k].default === 'function')
    .forEach(<K extends keyof T>(key: K) => {
      const driveFunc = normalizedConfig[key].default as (deps: Reactive<T>) => T[K];
      Object.defineProperty(state, key, {
        get: () => driveFunc(state),
        set: (val: T[K]) => {
          normalizedConfig[key].callback && normalizedConfig[key].callback(val);
          throw new Error(`请通过 update 方法修改主动变量`);
        }
      });
    });

  const update = () => {
    // 触发所有从动变量更新
    Object.keys(normalizedConfig)
      .filter(k => typeof normalizedConfig[k].default === 'function')
      .forEach(k => {
        // 这里可能需要根据具体需求实现更新逻辑
      });
  };

  const debug = () => {
    console.log('State:', state);
    console.log('Config:', normalizedConfig);
  };

  return Object.assign(state, { update, debug }) as T & { update: () => void; debug: () => void };
}


export const createDynamicState = <S>(option: {
  default: keyof S,
  callBackOpt: {
    [K in keyof S]: (state: S) => void
  }
}) => {
  const { default: defaultKey, callBackOpt } = option;
  // const state = reactive<S>({} as any);
  // state[defaultKey] = callBackOpt[defaultKey];
  // return state;
}
