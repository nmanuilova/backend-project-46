import _ from 'lodash';
import getStylishFormat from './stylish.js';
import getPlainFormat from './plain.js';

const formatters = {
  stylish: getStylishFormat,
  plain: getPlainFormat,
  json: JSON.stringify,
};

export default function getFormatter(name) {
  if (!_.has(formatters, name)) {
    throw new Error(`Unknown formatter ${name}.`);
  }
  return formatters[name];
}
