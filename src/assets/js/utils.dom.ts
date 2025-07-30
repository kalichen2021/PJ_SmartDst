import type { itemOrArray } from "./type";
import { toArray } from "./utils.base";

export const toDom = (elList: (HTMLElement | string)[]): (HTMLElement)[] => {
  return elList.map(el => {
    return typeof el === 'string'
      ? document.querySelector(el) as HTMLElement || el
      : el;
  });
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

  return {
    top: rect.top - marginTop,
    bottom: rect.bottom + marginBottom,
    left: rect.left - marginLeft,
    right: rect.right + marginRight,
    width: rect.width + marginLeft + marginRight,
    height: rect.height + marginTop + marginBottom,
  };
}

// 强制更新页面
export const focusRepaint = () => {
  document.querySelector("div")!.offsetHeight;
}

// 对特定style添加样式， 而不是整个更改
export const addPatternStyle = (el: HTMLElement, style: keyof CSSStyleDeclaration, addValue: string) => {
  // 获取当前样式值
  const curStyle = el.style.getPropertyValue(String(style));

  // 定义匹配函数名和参数的正则表达式
  const patternFn = /[a-z]+(?=\(.*\))/g;
  const patternParam = /\(.*?\)/g;

  // 提取当前样式和新增样式中的函数名
  const curStyleFnPatterns = curStyle.match(patternFn) || [];
  const addStyleFnPatterns = addValue.match(patternFn) || [];

  // 提取当前样式中的参数
  const curStyleParams = curStyle.match(patternParam) || [];

  // 初始化最终样式为新增样式
  let finalPattern: string = addValue;

  // 遍历当前样式中的函数，如果不在新增样式中，则添加到最终样式
  for (let i = 0; i < curStyleFnPatterns.length; i++) {
    if (!addStyleFnPatterns.includes(curStyleFnPatterns[i] as never)) {
      finalPattern += `${curStyleFnPatterns[i]}${curStyleParams[i]} `;
    }
  }

  // 设置最终样式
  el.style.setProperty(String(style), finalPattern.trim());
}


// 移除特定style样式
export const removePatternStyle = (el: HTMLElement, style: keyof CSSStyleDeclaration, removeFns: string[]) => {
  // 获取当前样式值
  const curStyle = el.style.getPropertyValue(String(style));

  // 定义匹配函数名和参数的正则表达式
  const patternFn = /[a-z]+(?=\(.*\))/g;
  const patternParam = /\(.*?\)/g;

  // 提取当前样式中的函数名
  const curStyleFnPatterns = curStyle.match(patternFn) || [];

  // 提取当前样式中的参数
  const curStyleParams = curStyle.match(patternParam) || [];

  // 过滤掉需要移除的函数
  const remainingPatterns = curStyleFnPatterns
    .map((fn, i) => ({ fn, param: curStyleParams[i] }))
    .filter(item => !removeFns.includes(item.fn as never));

  // 构建最终样式字符串
  const finalPattern = remainingPatterns
    .map(item => `${item.fn}${item.param}`)
    .join(' ');

  el.style.setProperty(String(style), finalPattern);
}

export const PatternStyle = (el: HTMLElement, option: "Add" | "Remove", style: keyof CSSStyleDeclaration, patterns: itemOrArray<string>) => {
  patterns = toArray(patterns)
  if (option === "Add") {
    addPatternStyle(el, style, patterns.join(" "));
  } else {
    removePatternStyle(el, style, patterns);
  }
}
