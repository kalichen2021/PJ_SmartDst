import { type Ref, ref } from "vue";
import type { itemOrArray } from "./type";




export const isInDom = (el: HTMLElement, parent: HTMLElement): boolean => {
  if (el === parent) {
    return true;
  }
  if (el.parentNode === null) {
    return false;
  }
  return el.parentElement !== null && isInDom(el.parentElement, parent);
}

export const toArray = <T>(i: itemOrArray<T>): T[] => {
  if (Array.isArray(i)) return i
  return [i];
}


/**
 * 点击空白位置，隐藏控件
 * @param willHiddenElement 需要隐藏的元素组, mousedown事件的e.target将会排除这些元素及其子元素, mousedown事件后隐藏
 * @param excludeElementGrp 需要排除的元素组, mousedown事件的e.target将会排除这些元素及其子元素
 * @param isVisibleVal 需要隐藏的元素组的显示状态, mousedown事件赋值为false
 */
export const clickSwhToHide = (
  willHiddenElement: itemOrArray<HTMLElement>,
  excludeElementGrp: itemOrArray<HTMLElement> = [],
  isVisibleVal: Ref<boolean | null> = ref(null),
) => {
  // tips：ts 类型断言，会影响整个文件的类型推导
  excludeElementGrp = toArray(excludeElementGrp);
  willHiddenElement = toArray(willHiddenElement);

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
    };
    document.removeEventListener("mousedown", _hide);
    if (typeof isVisibleVal.value === "boolean") {
      isVisibleVal.value = false;
      return;
    }
    [...willHiddenElement].forEach((el) => (el.style.display = "none"));
  };

  document.addEventListener("mousedown", _hide);
};

export const logPerformance = (label: string): void => {
  console.time(label);
  // 执行需要监控的代码
  console.timeEnd(label);
}