const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const operationLogService = require('../services/operationLog.service');

const getOperationLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const result = await operationLogService.getOperationLogs(filter, options);
  res.send({ data: result, message: 'operationLog lists' });
});

const createOperationLog = catchAsync(async (req, res) => {
  const operationLog = await operationLogService.createOperationLog({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: operationLog, message: 'operationLog created' });
});

const getOperationLog = catchAsync(async (req, res) => {
  const operationLog = await operationLogService.getOperationLogById(req.params.id);
  if (!operationLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'operationLog फेला परेन');
  }
  res.send({ data: operationLog, message: 'operationLog detail' });
});

const updateOperationLog = catchAsync(async (req, res) => {
  const operationLog = await operationLogService.updateOperationLogById(req.params.id, {
    ...req.body,
    updatedBy: req.user.id,
  });
  res.send({ data: operationLog, message: 'operationLog updated' });
});

const deleteOperationLog = catchAsync(async (req, res) => {
  await operationLogService.deleteOperationLogById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getOperationLogs,
  createOperationLog,
  getOperationLog,
  updateOperationLog,
  deleteOperationLog,
};
