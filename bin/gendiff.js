#!/usr/bin/env node
import { Command } from 'commander';
import _ from 'lodash';
import { build, parse } from '../src/index.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --help', 'output usage information')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
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

    console.log(`{\n${result}}`);
  });

program.parse();
