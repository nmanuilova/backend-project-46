import fs from 'fs';
import path from 'node:path';

const parse = (filepath) => {
  const data = fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8');
  const obj = JSON.parse(data);
  return obj;
};

const build = (key, obj1, obj2) => {
  if (key in obj1 && key in obj2) {
    if (obj1[key] !== obj2[key]) {
      return { key, value: [obj1[key], obj2[key]], type: 'changed' };
    }
    return { key, value: [obj1[key]], type: 'unchanged' };
  } if (key in obj1) {
    return { key, value: [obj1[key]], type: 'deleted' };
  }
  return { key, value: [obj2[key]], type: 'added' };
};

export { build, parse };
