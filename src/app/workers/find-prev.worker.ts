/// <reference lib="webworker" />

const find = (arr, field) => {
  if (!Array.isArray(arr)) {
    return undefined;
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    const current = arr[i];
    const prev = arr[i - 1];
    if (i > 0 && prev !== undefined && current[field] <= prev[field]) {
      return arr[i - 1];
    }
  }
};

const validate = (source) => {
  const item = find(source, 'days');
  return item !== undefined ? {prev: true} : null;
};

addEventListener('message', ({ data }) => {
  postMessage(validate(data));
});
