const stringifyFilter = (filters = {}) => {
  let filterString = '';
  for (const property in filters) {
    filterString += ` ${property}: ${filters[property]}`;
  }
  return filterString;
};

module.exports = stringifyFilter;
