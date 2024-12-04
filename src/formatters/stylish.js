function customStringify(obj, depth) {
  if (typeof obj !== 'object' || obj === null) {
    return String(obj);
  }

  const indentSize = depth * 4;
  const currentIndent = ' '.repeat(indentSize + 4);
  const bracesIndent = ' '.repeat(indentSize);

  const entries = Object.entries(obj)
    .map(([key, value]) => `${currentIndent}${key}: ${customStringify(value, depth + 1)}`)
    .join('\n');

  return `{\n${entries}\n${bracesIndent}}`;
}

function getSpace(depth) {
  return ' '.repeat(depth * 4 + 2);
}

function getStylishFormat(data) {
  const iter = (items, depth) => items.map((item) => {
    const space = getSpace(depth);
    const value = (val, d = depth + 1) => customStringify(val, d);

    const actions = {
      deleted: () => `${space}- ${item.key}: ${value(item.value[0])}`,
      added: () => `${space}+ ${item.key}: ${value(item.value[0])}`,
      changed: () => `${space}- ${item.key}: ${value(item.value[0])}\n${space}+ ${item.key}: ${value(item.value[1])}`,
      unchanged: () => `${space}  ${item.key}: ${value(item.value[0])}`,
      nested: () => `${space}  ${item.key}: {\n${iter(item.value, depth + 1)}\n${space}  }`,
    };

    if (!actions[item.type]) {
      throw new Error(`Unknown type: ${item.type}`);
    }

    return actions[item.type]();
  }).join('\n');

  return `{\n${iter(data, 0)}\n}`;
}

export default getStylishFormat;
