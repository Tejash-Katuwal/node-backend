const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const deviceService = require('../services/device.service');
const scheduleService = require('../services/schedule.service');
const { getUserInfoLog } = require('../services/command.service');

const getDevices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'organization']);
  console.log(filter);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'organization', select: 'name' }];
  const result = await deviceService.getDevices(filter, options);
  res.send({ data: result, message: 'device lists' });
});

const createDevice = catchAsync(async (req, res) => {
  const device = await deviceService.createDevice({
    ...req.body,
    createdBy: req.user.id,
  });

  await scheduleService.parallelQueue.createInstance(device.serial_number);

  res.status(httpStatus.CREATED).send({ data: device, message: 'device created' });
});

const getDevice = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.id, req.query.organization);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'device फेला परेन');
  }
  res.send({ data: device, message: 'device detail' });
});

const updateDevice = catchAsync(async (req, res) => {
  const device = await deviceService.updateDeviceById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  res.send({ data: device, message: 'device updated' });
});

const deleteDevice = catchAsync(async (req, res) => {
  await deviceService.deleteDeviceById(req.params.id, req.query.organization);
  res.status(httpStatus.NO_CONTENT).send();
});

const syncUserFromDevice = catchAsync(async (req, res) => {
  await scheduleService.deviceQueue.addBySN(req.params.serial_number, getUserInfoLog());
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getDevices,
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  syncUserFromDevice,
};
