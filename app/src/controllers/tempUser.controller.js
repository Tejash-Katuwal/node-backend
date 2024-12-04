const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const tempUserService = require('../services/tempUser.service');
const { deviceQueue } = require('../services/schedule.service');
const { userCreateUpdateCommand, userDeleteCommand } = require('../services/command.service');

const getTempUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'department']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const result = await tempUserService.getTempUsers(filter, options);
  res.send({ data: result, message: 'tempUser lists' });
});

const createTempUser = catchAsync(async (req, res) => {
  const tempUser = await tempUserService.createTempUser({
    ...req.body,
    createdBy: req.user.id,
  });
  await deviceQueue.add(tempUser.department, userCreateUpdateCommand(tempUser));

  res.status(httpStatus.CREATED).send({ data: tempUser, message: 'tempUser created' });
});

const getTempUser = catchAsync(async (req, res) => {
  const tempUser = await tempUserService.getTempUserById(req.params.id);
  if (!tempUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'tempUser फेला परेन');
  }
  res.send({ data: tempUser, message: 'tempUser detail' });
});

const updateTempUser = catchAsync(async (req, res) => {
  const tempUser = await tempUserService.updateTempUserById(req.params.id, {
    ...req.body,
    updatedBy: req.user.id,
  });
  await deviceQueue.add(tempUser.department, userCreateUpdateCommand(tempUser));

  res.send({ data: tempUser, message: 'tempUser updated' });
});

const deleteTempUser = catchAsync(async (req, res) => {
  const user = await tempUserService.deleteTempUserById(req.params.id);
  await deviceQueue.add(user.department, userDeleteCommand(user.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getTempUsers,
  createTempUser,
  getTempUser,
  updateTempUser,
  deleteTempUser,
};
