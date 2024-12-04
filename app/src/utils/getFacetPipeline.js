module.exports = (options = {}, pipelines = []) => {
  return {
    $facet: {
      // eslint-disable-next-line radix
      pagination: [{ $count: 'total' }, { $addFields: { page: parseInt(options.page || 1) } }],
      docs: [
        {
          // eslint-disable-next-line radix
          $skip: (parseInt(options.page || 1) - 1) * parseInt(options.limit || 10),
        },
        {
          // eslint-disable-next-line radix
          $limit: parseInt(options.limit || 10),
        },
        ...pipelines,
      ],
    },
  };
};
