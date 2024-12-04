import yaml from 'js-yaml';

const parsers = { yml: yaml.load, yaml: yaml.load, json: JSON.parse };

const parse = (data, format) => {
  if (parsers[format] === undefined) {
    throw new Error(`${format} format is not supported. Supported ${Object.keys(parsers).join(', ')} formats`);
  }
  return parsers[format](data);
};

export default parse;
