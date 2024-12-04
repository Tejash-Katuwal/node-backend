const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { ORGANIZATIONTYPE } = require('../config/enum');

const getOrganizations = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    type: Joi.string(),
    noPagination: Joi.boolean().default(true),
  }),
};

const createOrganization = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    device: Joi.array().items(Joi.string()),
    type: Joi.string().default('organization'),
    organization: Joi.string().custom(objectId),
    image: Joi.string(),
    organizationType: Joi.string().custom(objectId),
    attendeeTypes: Joi.alternatives().conditional('type', [
      {
        is: 'department',
        then: Joi.array().items(Joi.string().valid(...ORGANIZATIONTYPE.ENUM)),
      },
    ]),
  }),
};

const getOrganization = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateOrganization = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      phone: Joi.string(),
      address: Joi.string(),
      device: Joi.array().items(Joi.string()),
      type: Joi.string().default('organization'),
      organization: Joi.string().custom(objectId),
      organizationType: Joi.string().custom(objectId),
      image: Joi.string(),
      attendeeTypes: Joi.alternatives().conditional('type', [
        {
          is: 'department',
          then: Joi.array().items(Joi.string().valid(...ORGANIZATIONTYPE.ENUM)),
        },
      ]),
    })
    .min(1),
};

const deleteOrganization = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
};
