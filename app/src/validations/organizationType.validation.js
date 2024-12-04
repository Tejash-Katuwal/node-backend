const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { ORGANIZATIONTYPE } = require('../config/enum');

const getOrganizationTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
  }),
};

const createOrganizationType = {
  body: Joi.object().keys({
    name_en: Joi.string().required(),
    name_np: Joi.string().required(),
    attendeeTypes: Joi.array()
      .items(Joi.string().valid(...ORGANIZATIONTYPE.ENUM))
      .min(1)
      .required(),
  }),
};

const getOrganizationType = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateOrganizationType = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name_en: Joi.string(),
      name_np: Joi.string(),
      attendeeTypes: Joi.array()
        .items(Joi.string().valid(...ORGANIZATIONTYPE.ENUM))
        .min(1),
    })
    .min(1),
};

const deleteOrganizationType = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getOrganizationTypes,
  createOrganizationType,
  getOrganizationType,
  updateOrganizationType,
  deleteOrganizationType,
};
