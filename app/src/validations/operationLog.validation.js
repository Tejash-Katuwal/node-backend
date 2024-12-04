const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getOperationLogs = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
  }),
};

const createOperationLog = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    type: Joi.string(),
    time: Joi.string(),
    value1: Joi.string(),
    value2: Joi.string(),
    value3: Joi.string(),
    reserved: Joi.string(),
  }),
};

const getOperationLog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateOperationLog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string(),
      type: Joi.string(),
      time: Joi.string(),
      value1: Joi.string(),
      value2: Joi.string(),
      value3: Joi.string(),
      reserved: Joi.string(),
    })
    .min(1),
};

const deleteOperationLog = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getOperationLogs,
  createOperationLog,
  getOperationLog,
  updateOperationLog,
  deleteOperationLog,
};
