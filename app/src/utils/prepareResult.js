module.exports = (data, options) => {
  const desiredDocs = data[0].docs ? data[0].docs : [];

  // // eslint-disable-next-line radix
  const pagination =
    data[0].pagination && data[0].pagination[0] !== undefined
      ? data[0].pagination[0] // eslint-disable-next-line radix
      : { total: 0, page: parseInt(options.page) };

  return {
    results: desiredDocs,
    page: pagination.page,
    limit: options.limit,
    totalPages: Math.ceil(pagination.total / options.limit),
    totalResults: pagination.total,
  };
};
