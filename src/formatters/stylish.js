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
  return ' '.repeat(depth * 4 + 2); // Отступ в 4 пробела на уровень вложенности
}

function getStylishFormat(data) {
  const iter = (items, depth) => {
    const result = items.map((item) => {
      switch (item.type) {
        case 'deleted':
          return `${getSpace(depth)}- ${item.key}: ${customStringify(item.value[0], depth + 1)}`;
        case 'added':
          return `${getSpace(depth)}+ ${item.key}: ${customStringify(item.value[0], depth + 1)}`;
        case 'changed':
          return (
            `${getSpace(depth)}- ${item.key}: ${customStringify(item.value[0], depth + 1)}\n`
                        + `${getSpace(depth)}+ ${item.key}: ${customStringify(item.value[1], depth + 1)}`
          );
        case 'unchanged':
          return `${getSpace(depth)}  ${item.key}: ${customStringify(item.value[0], depth + 1)}`;
        case 'nested':
          return (
            `${getSpace(depth)}  ${item.key}: {\n`
                        + `${iter(item.value, depth + 1)}\n`
                        + `${getSpace(depth)}  }`
          );
        default:
          throw new Error(`Unknown type: ${item.type}`);
      }
    });
    return result.join('\n');
  };
  return `{\n${iter(data, 0)}\n}`;
}

export default getStylishFormat;
