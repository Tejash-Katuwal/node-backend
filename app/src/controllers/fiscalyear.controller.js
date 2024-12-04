const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fiscalYearService } = require('../services');

const createFiscalYear = catchAsync(async (req, res) => {
  const fiscalyear = await fiscalYearService.createFiscalYear(req.body);
  res
    .status(httpStatus.CREATED)
    .send({ data: fiscalyear, message: 'FiscalYear created [                                     ' });
});

const getFiscalYears = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const result = await fiscalYearService.queryFiscalYears(filter, options);
  res.send({ data: result, messaage: 'fiscalyear lists' });
});

const getFiscalYear = catchAsync(async (req, res) => {
  const fiscalyear = await fiscalYearService.getFiscalYearById(req.params.id);
  if (!fiscalyear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FiscalYear भेटिएन । ');
  }
  res.send({ data: fiscalyear, message: 'fiscalyear details' });
});

const getActiveFiscalYear = catchAsync(async (req, res) => {
  const { data: fiscalyear, cache } = await fiscalYearService.getActiveFiscalYear();
  if (!fiscalyear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FiscalYear भेटिएन । ');
  }
  res.send({ data: fiscalyear, message: 'active fiscal year details', cache });
});

const activateFiscalYear = catchAsync(async (req, res) => {
  const fiscalyear = await fiscalYearService.updateFiscalYearById(req.body.id, { active: true });
  res.send({ data: fiscalyear, message: 'fiscalyear activated' });
});

const updateFiscalYear = catchAsync(async (req, res) => {
  const fiscalyear = await fiscalYearService.updateFiscalYearById(req.params.id, req.body);
  res.send({ data: fiscalyear, message: 'fiscalyear updated' });
});

const deleteFiscalYear = catchAsync(async (req, res) => {
  await fiscalYearService.deleteFiscalYearById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFiscalYear,
  getFiscalYears,
  getFiscalYear,
  updateFiscalYear,
  deleteFiscalYear,
  getActiveFiscalYear,
  activateFiscalYear,
};
