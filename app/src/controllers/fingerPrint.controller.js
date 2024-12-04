const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fingerPrintService } = require('../services');

const getFingerPrints = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const filter = pick(req.query, ['applicant']);
  const result = await fingerPrintService.queryFingerPrints(filter, options);
  res.send({ data: result, messaage: 'disabledProfile lists' });
});

const getFingerPrint = catchAsync(async (req, res) => {
  const fingerPrint = await fingerPrintService.getFingerPrintById(req.params.id);
  if (!fingerPrint) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fingerPrint भेटिएन । ');
  }
  res.send({ data: fingerPrint, message: 'fingerPrint details' });
});

const getFingerPrintApplicant = catchAsync(async (req, res) => {
  const fingerPrint = await fingerPrintService.getFingerPrintByApplicantId(req.params.id);
  if (!fingerPrint) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fingerPrint भेटिएन । ');
  }
  res.send({ data: fingerPrint, message: 'fingerPrint details' });
});

module.exports = {
  getFingerPrints,
  getFingerPrint,
  getFingerPrintApplicant,
};
