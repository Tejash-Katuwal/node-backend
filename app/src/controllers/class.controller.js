const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const classService = require('../services/class.service');

const getClasss = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'organization']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'studentCount' }, { path: 'organization', select: 'name' }];
  const result = await classService.getClasss(filter, options);
  res.send({ data: result, message: 'class lists' });
});

const createClass = catchAsync(async (req, res) => {
  const newClass = await classService.createClass({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: newClass, message: 'class created' });
});

const getClass = catchAsync(async (req, res) => {
  const newClass = await classService.getClassById(req.params.id, req.query.organization);
  if (!newClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'class फेला परेन');
  }
  res.send({ data: newClass, message: 'class detail' });
});

const updateClass = catchAsync(async (req, res) => {
  const newClass = await classService.updateClassById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  res.send({ data: newClass, message: 'class updated' });
});

const deleteClass = catchAsync(async (req, res) => {
  await classService.deleteClassById(req.params.id, req.query.organization);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getClasss,
  createClass,
  getClass,
  updateClass,
  deleteClass,
};
