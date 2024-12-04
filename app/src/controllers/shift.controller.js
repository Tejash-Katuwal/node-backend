const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const shiftService = require('../services/shift.service');

const getShifts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'organization']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'organization', select: 'name' }];
  const result = await shiftService.getShifts(filter, options);
  res.send({ data: result, message: 'shift lists' });
});

const createShift = catchAsync(async (req, res) => {
  const shift = await shiftService.createShift({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: shift, message: 'shift created' });
});

const getShift = catchAsync(async (req, res) => {
  const shift = await shiftService.getShiftById(req.params.id, req.query.organization);
  if (!shift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shift फेला परेन');
  }
  res.send({ data: shift, message: 'shift detail' });
});

const updateShift = catchAsync(async (req, res) => {
  const shift = await shiftService.updateShiftById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  res.send({ data: shift, message: 'shift updated' });
});

const deleteShift = catchAsync(async (req, res) => {
  await shiftService.deleteShiftById(req.params.id, req.query.organization);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getShifts,
  createShift,
  getShift,
  updateShift,
  deleteShift,
};
