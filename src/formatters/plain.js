const toFormattedString = (value) => {
  if (value === null) return value;

  const type = typeof value;
  if (type === 'object') return '[complex value]';
  if (type === 'string') return `'${value}'`;

  return value;
};

function getPlainFormat(data) {
  function iter(items, path) {
    return items
      .flatMap((item) => {
        const currentPath = [...path, item.key];
        const pathString = currentPath.join('.');

        switch (item.type) {
          case 'deleted':
            return `Property '${pathString}' was removed`;
          case 'added':
            return `Property '${pathString}' was added with value: ${toFormattedString(item.value[0])}`;
          case 'nested': {
            const nestedResult = iter(item.value, currentPath);
            return nestedResult.length > 0 ? nestedResult : [];
          }
          case 'changed':
            return `Property '${pathString}' was updated. From ${toFormattedString(item.value[0])} to ${toFormattedString(item.value[1])}`;
          default:
            return [];
        }
      })
      .join('\n');
  }

  return iter(data, []);
}

export default getPlainFormat;
