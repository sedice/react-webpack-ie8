export const debounce = (fn: (...args: any[]) => any, wait = 500) => {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};
