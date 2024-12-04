const Joi = require('joi');

const getFingerPrints = {
  query: Joi.object().keys({
    applicant: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
  }),
};

const getFingerPrint = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

module.exports = {
  getFingerPrints,
  getFingerPrint,
};
