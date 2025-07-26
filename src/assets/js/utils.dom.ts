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

// 获得css根变量
export const getCssVal = (valName: string) => {
  const root = document.documentElement;
  const cssVar = getComputedStyle(root);
  return cssVar.getPropertyValue(valName).trim();
}

// 强制更新页面
export const focusRepaint = () => {
  document.querySelector("div")!.offsetHeight;
}
