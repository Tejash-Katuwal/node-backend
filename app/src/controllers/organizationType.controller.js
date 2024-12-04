const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const organizationTypeService = require('../services/organizationType.service');

const getOrganizationTypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const result = await organizationTypeService.getOrganizationTypes(filter, options);
  res.send({ data: result, message: 'organizationType lists' });
});

const createOrganizationType = catchAsync(async (req, res) => {
  const organizationType = await organizationTypeService.createOrganizationType({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: organizationType, message: 'organizationType created' });
});

const getOrganizationType = catchAsync(async (req, res) => {
  const organizationType = await organizationTypeService.getOrganizationTypeById(req.params.id);
  if (!organizationType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'organizationType फेला परेन');
  }
  res.send({ data: organizationType, message: 'organizationType detail' });
});

const updateOrganizationType = catchAsync(async (req, res) => {
  const organizationType = await organizationTypeService.updateOrganizationTypeById(req.params.id, {
    ...req.body,
    updatedBy: req.user.id,
  });
  res.send({ data: organizationType, message: 'organizationType updated' });
});

const deleteOrganizationType = catchAsync(async (req, res) => {
  await organizationTypeService.deleteOrganizationTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getOrganizationTypes,
  createOrganizationType,
  getOrganizationType,
  updateOrganizationType,
  deleteOrganizationType,
};
