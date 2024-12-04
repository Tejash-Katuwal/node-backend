const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const organizationService = require('../services/organization.service');

const getOrganizations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'organization']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [
    { path: 'organization', select: 'name' },
    { path: 'organizationType', select: 'name_np name_en' },
  ];
  const result = await organizationService.getOrganizations(filter, options);
  res.send({ data: result, message: 'organization lists' });
});

const createOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.createOrganization({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: organization, message: 'organization created' });
});

const getOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.getOrganizationById(req.params.id);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'organization फेला परेन');
  }
  res.send({ data: organization, message: 'organization detail' });
});

const updateOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.updateOrganizationById(req.params.id, {
    ...req.body,
    updatedBy: req.user.id,
  });
  res.send({ data: organization, message: 'organization updated' });
});

const deleteOrganization = catchAsync(async (req, res) => {
  await organizationService.deleteOrganizationById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
};
