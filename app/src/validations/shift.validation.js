const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getShifts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
  }),
};

const createShift = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    organization: Joi.string().custom(objectId).required(),
  }),
};

const getShift = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateShift = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      start_time: Joi.string(),
      end_time: Joi.string(),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteShift = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getShifts,
  createShift,
  getShift,
  updateShift,
  deleteShift,
};
