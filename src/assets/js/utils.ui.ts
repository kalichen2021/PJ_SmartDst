import type { itemOrArray } from "./type";
import { toArray, toDom, isInDom } from "./utils";



const customStorage: { hideCallback?: Function } = {};
/**
 * 点击空白位置，隐藏控件
 * @param willHiddenElement 需要隐藏的元素组, mousedown事件的e.target将会排除这些元素及其子元素, mousedown事件后隐藏
 * @param excludeElementGrp 需要排除的元素组, mousedown事件的e.target将会排除这些元素及其子元素
 * @param hideCallback 隐藏后的回调函数，mousedown事件触发
 * @param isVisibleVal 需要隐藏的元素组的显示状态（ref响应式变量）, mousedown事件赋值为false
 */
export const clickSwhToHide = (
  willHiddenElement: itemOrArray<HTMLElement | string>,
  excludeElementGrp: itemOrArray<HTMLElement | string> = [],
  hideCallback?: Function,
) => {
  // tips：ts 类型断言，会影响整个文件的类型推导
  const _excludeElementGrp = toDom(toArray(excludeElementGrp));
  const _willHiddenElement = toDom(toArray(willHiddenElement));
  customStorage.hideCallback = hideCallback;

  /**
   * @param targetEl 目标元素
   * @returns 是否在排除元素组中
   */
  const _isExcludeEl = (targetEl: HTMLElement): boolean => {
    // tips: 使用return时注意多层嵌套
    let _r = false;
    [..._excludeElementGrp, ..._willHiddenElement].forEach((el) => {
      // if (isInDom(targetEl, el)) return true;;
      if (isInDom(targetEl, el)) {
        _r = true;
        return;
      };
    })
    return _r;
  };

  /**
   * @param e mousedown事件
   * @returns 
   */
  const _hide = (e: MouseEvent) => {
    if (_isExcludeEl(e.target as HTMLElement)) {
      console.log("点击了排除元素");
      return;
    }
    console.log("点击了空白位置");
    // 点击空白位置，隐藏控件
    document.removeEventListener("mousedown", _hide);
    [..._willHiddenElement].forEach((el) => (el.style.display = "none"));
    customStorage.hideCallback?.();
  };
  document.addEventListener("mousedown", _hide);
};
