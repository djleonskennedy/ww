/// <reference lib="webworker" />

import {User} from '../model/users';

const find = (items: User[], field: string) => {
  const invalid = [];
  if (!Array.isArray(items)) {
    return undefined;
  }
  for (let i = 0, len = items.length; i < len; i++) {
    const current = items[i];
    const prev = items[i - 1];
    if (i > 0 && prev !== undefined && parseInt(current[field], 10) <= parseInt(prev[field], 10)) {
      invalid.push(current.id);
    }
  }
  return invalid;
};

const validate = (source) => {
  const invalidIds = find(source, 'days');
  return invalidIds.length > 0 ? {prev: invalidIds} : null;
};

addEventListener('message', ({ data }: {data: {index: number, items: User}}) => {
  postMessage(validate(data));
});
