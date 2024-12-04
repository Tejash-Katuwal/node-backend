const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getHolidays = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    organization: Joi.string().custom(objectId),
    noPagination: Joi.boolean().default(true),
    name: Joi.string(),
  }),
};

const createHoliday = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    organization: Joi.string().custom(objectId).required(),
  }),
};

const getHoliday = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateHoliday = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      startDate: Joi.string(),
      endDate: Joi.string(),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteHoliday = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getHolidays,
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday,
};
