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
      callback?: (newVal: typeof _config.default) => void
    } | T[K] | ((deps: Omit<T, K>) => T[K])
  },
) => {
  // !!优化类型断言
  let NormolizeConfig: Record<string, any> = {}, config: {
    [K in keyof T]: {
      default: T[K] | ((deps: Omit<T, K>) => T[K]),
      callback?: (state: Reactive<{ [K in keyof T]: T[K]; }>) => void
    }
  }
  Object.keys(_config)
    .forEach(k => {
      const value = typeof _config[k] === 'object'
        ? _config[k]
        : {
          default: _config[k]
        }
      NormolizeConfig[k] = value
    })
  config = NormolizeConfig as unknown as {
    [K in keyof T]: {
      default: T[K] | ((deps: Omit<T, K>) => T[K]),
      callback?: (state: Reactive<{ [K in keyof T]: T[K]; }>) => void
    }
  }

  const state = reactive<{ [K in keyof T]: T[K] }>({} as any);
  // 为所有主动变量创建ref
  Object.keys(config)
    .filter(k => typeof config[k].default !== 'function')
    .forEach(k => {
      Object.defineProperty(state, k, {
        get: () => config[k].default,
        set: (val) => {
          config[k].default = val;
          // triggerRef(activeRefs[k]);
          config[k].callback && config[k].callback(val)
        }
      })
    })
  // 为所有从动变量创建ref
  Object.keys(config)
    .filter(k => typeof config[k].default === 'function')
    .forEach(k => {
      const driveFunc = config[k].default as (deps: any) => T[typeof k];
      Object.defineProperty(state, k, {
        get: () => driveFunc(state),
        set: (val) => {
          config[k].callback && config[k].callback(state)
          throw new Error(`请通过 update 方法修改主动变量`);
        }
      })
    })


  const update = () => { }

  const debug = () => { }

  return Object.assign(state, { update, debug });
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
