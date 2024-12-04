import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const getExtension = (filepath) => filepath.split('.').at(-1);

const readFile = (filepath) => fs.readFileSync(path.resolve(process.cwd(), '__fixtures__', filepath), 'utf-8');

const build = (obj1, obj2) => {
  const commonKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

  return commonKeys
    .flatMap((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (!_.has(obj1, key)) {
        return { key, value: [val2], type: 'added' };
      }
      if (!_.has(obj2, key)) {
        return { key, value: [val1], type: 'deleted' };
      }
      if (_.isObject(val1) && _.isObject(val2)) {
        return { key, value: build(val1, val2), type: 'nested' };
      } 
      if (val1 === val2) {
        return { key, value: [val1], type: 'unchanged' };
      }
      return { key, value: [val1, val2], type: 'changed' };
    });
};

const genDiff = (filepath1, filepath2, outputFormat) => {
  const data1 = parse(readFile(filepath1), getExtension(filepath1));
  const data2 = parse(readFile(filepath2), getExtension(filepath2));

  const ast = build(data1, data2);
  return getFormatter(outputFormat)(ast);
};

export default genDiff;
