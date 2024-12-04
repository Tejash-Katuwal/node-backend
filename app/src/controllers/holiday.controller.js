const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const holidayService = require('../services/holiday.service');
const { getDatesBetween } = require('../services/calendar.service');

const getHolidays = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'organization']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'organization', select: 'name' }];
  const result = await holidayService.getHolidays(filter, options);
  res.send({ data: result, message: 'holiday lists' });
});

const createHoliday = catchAsync(async (req, res) => {
  const body = { ...req.body };
  body.dates = getDatesBetween(body.startDate, body.endDate);
  const holiday = await holidayService.createHoliday({
    ...body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: holiday, message: 'holiday created' });
});

const getHoliday = catchAsync(async (req, res) => {
  const holiday = await holidayService.getHolidayById(req.params.id, req.query.organization);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, 'holiday फेला परेन');
  }
  res.send({ data: holiday, message: 'holiday detail' });
});

const updateHoliday = catchAsync(async (req, res) => {
  const holiday = await holidayService.updateHolidayById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  res.send({ data: holiday, message: 'holiday updated' });
});

const deleteHoliday = catchAsync(async (req, res) => {
  await holidayService.deleteHolidayById(req.params.id, req.query.organization);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getHolidays,
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday,
};
