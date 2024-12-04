const Joi = require('joi');
const { objectId, getMessages } = require('./custom.validation');

const createFiscalYear = {
  body: Joi.object().keys({
    title: Joi.string().required().messages(getMessages('वर्ष', 'string')),
    is_active: Joi.boolean().default(false).messages(getMessages('चालु आर्थिक वर्ष', 'boolean')),
  }),
};

const getFiscalYears = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
  }),
};

const getFiscalYear = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const updateFiscalYear = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().messages(getMessages('वर्ष', 'string')),
    })
    .min(1),
};

const activateFiscalYear = {
  body: Joi.object()
    .keys({
      id: Joi.required(),
    })
    .min(1),
};

const deleteFiscalYear = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

module.exports = {
  createFiscalYear,
  getFiscalYears,
  getFiscalYear,
  updateFiscalYear,
  deleteFiscalYear,
  activateFiscalYear,
};
