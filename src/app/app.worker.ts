/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  console.log(data);
  const errors = (data as Array<{name: string; days: number}>).reduce((acc, x) => {
    const err = x.days > 100 ? {big: true} : {};
    return {...acc, ...err};
  }, {});
  console.log(errors);
  postMessage(errors);
});
