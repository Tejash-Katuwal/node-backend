const catchAsync = require('../utils/catchAsync');
const { nagarpalikaService } = require('../services');

const updateNagarpalika = catchAsync(async (req, res) => {
  const nagarpalika = await nagarpalikaService.updateNagarpalika(req.body);
  res.send(nagarpalika);
});

const getNagarpalika = catchAsync(async (req, res) => {
  const { data, cache } = await nagarpalikaService.getNagarpalika();
  if (data.length === 0) res.send({ data: {}, message: 'nagarpalika details' });
  else res.send({ data: data.pop(), message: 'nagarpalika details', cache });
});

module.exports = { updateNagarpalika, getNagarpalika };
