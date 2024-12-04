const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getTempUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    department: Joi.string().custom(objectId),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
  }),
};

const createTempUser = {
  body: Joi.object().keys({
    validity: Joi.string().required(),
    card_number: Joi.string().required(),
    shift: Joi.string().required().custom(objectId),
    username: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string(),
    role: Joi.string().required(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    image: Joi.string(),
    phone: Joi.string(),
    ward: Joi.string(),
    fiscal: Joi.string(),
    status: Joi.string(),
    authMethod: Joi.string(),
    department: Joi.string().custom(objectId),
    organization: Joi.string().required().custom(objectId),
  }),
};

const getTempUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateTempUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      validity: Joi.string(),
      card_number: Joi.string(),
      shift: Joi.string().custom(objectId),
      email: Joi.string(),
      password: Joi.string(),
      role: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      image: Joi.string(),
      phone: Joi.string(),
      ward: Joi.string(),
      fiscal: Joi.string(),
      status: Joi.string(),
      authMethod: Joi.string(),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteTempUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getTempUsers,
  createTempUser,
  getTempUser,
  updateTempUser,
  deleteTempUser,
};
