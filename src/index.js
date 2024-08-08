import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const parsers = { yml: yaml.load, yaml: yaml.load, json: JSON.parse };

const parse = (filepath) => {
  const format = filepath.split('.').at(-1);
  if (parsers[format] === undefined) {
    throw new Error(`${format} format is not supported. Supported ${Object.keys(parsers).join(', ')} formats`);
  }
  const data = fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8');
  return parsers[format](data);
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

const genDiff = (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const sortedKeys1 = _.sortBy(Object.keys(data1));
  const sortedKeys2 = _.sortBy(Object.keys(data2));
  const commonKeys = _.union(sortedKeys1, sortedKeys2);

  const result = commonKeys
    .map((key) => build(key, data1, data2))
    .reduce((acc, item) => {
      let diff;
      switch (item.type) {
        case 'deleted':
          diff = `${acc} - ${item.key}: ${item.value[0]}\n`;
          break;
        case 'added':
          diff = `${acc} + ${item.key}: ${item.value[0]}\n`;
          break;
        case 'changed':
          diff = `${acc} - ${item.key}: ${item.value[0]}\n + ${item.key}: ${item.value[1]}\n`;
          break;
        case 'unchanged':
          diff = `${acc}   ${item.key}: ${item.value[0]}\n`;
          break;
        default:
          break;
      }
      return diff;
    }, '');

  return `{\n${result}}`;
};

export default genDiff;
