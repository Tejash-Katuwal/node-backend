const Joi = require('joi');
const { objectId, password, getMessages } = require('./custom.validation');

const getTeachers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    department: Joi.string().custom(objectId),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
  }),
};

const createTeacher = {
  body: Joi.object().keys({
    grade: Joi.string().custom(objectId),
    isClassTeacher: Joi.boolean().default(false),
    validity: Joi.string().required(),
    card_number: Joi.string().required(),
    shift: Joi.string().required(),
    username: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().custom(password).messages(getMessages('Password', 'string')),
    role: Joi.string().required(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    image: Joi.string(),
    phone: Joi.string(),
    ward: Joi.string(),
    fiscal: Joi.string(),
    authMethod: Joi.string(),
    department: Joi.string().custom(objectId),
    organization: Joi.string().required().custom(objectId),
  }),
};

const getTeacher = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateTeacher = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      grade: Joi.string().custom(objectId),
      isClassTeacher: Joi.boolean().default(false),
      validity: Joi.string(),
      card_number: Joi.string(),
      shift: Joi.string(),
      email: Joi.string(),
      password: Joi.string().custom(password).messages(getMessages('Password', 'string')),
      role: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      image: Joi.string(),
      phone: Joi.string(),
      ward: Joi.string(),
      fiscal: Joi.string(),
      authMethod: Joi.string(),
      status: Joi.string().valid('active', 'inactive', 'not_verified'),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteTeacher = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getTeachers,
  createTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
