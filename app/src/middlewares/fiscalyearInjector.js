const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fiscalYearService } = require('../services');

const fiscalYearInjector = catchAsync(async (req, res, next) => {
  const { data: activeFiscalYear } = await fiscalYearService.getActiveFiscalYear();
  if (!activeFiscalYear) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'No active fiscal year found'));
  }
  if (!req.body) {
    req.body = {};
  }
  req.body.fiscal = activeFiscalYear.id;
  req.fiscal = activeFiscalYear;

  next();
});

module.exports = fiscalYearInjector;
