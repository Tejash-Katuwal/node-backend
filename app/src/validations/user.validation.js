const Joi = require('joi');
const { password, objectId, getMessages } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages(getMessages('ईमेल', 'string')),
    password: Joi.string().required().custom(password).messages(getMessages('Password', 'string')),
    username: Joi.string().required().messages(getMessages('Username', 'string')),
    role: Joi.string().required().valid('admin', 'organizationAdmin').messages(getMessages('भूमिका', 'string')),
    organization: Joi.alternatives().conditional('role', [
      {
        is: 'organizationAdmin',
        then: Joi.string().required().custom(objectId).messages(getMessages('Organization', 'string')),
      },
    ]),
    isEmailVerified: Joi.boolean().default(false).messages(getMessages('isEmailVerified', 'boolean')),
    first_name: Joi.string().required().messages(getMessages('नाम', 'string')),
    last_name: Joi.string().required().messages(getMessages('थर', 'string')),
    image: Joi.string().messages(getMessages('Photo', 'string')),
    phone: Joi.string().required().messages(getMessages('Phone no.', 'string')),
    ward: Joi.string().custom(objectId).messages(getMessages('Ward', 'string')),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
    department: Joi.string().custom(objectId),
    grade: Joi.string().custom(objectId),
  }),
};

const getUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().messages(getMessages('ईमेल', 'string')),
      password: Joi.string().custom(password).messages(getMessages('Password', 'string')),
      username: Joi.string().messages(getMessages('Username', 'string')),
      role: Joi.string().valid('admin', 'organizationAdmin').messages(getMessages('भूमिका', 'string')),
      isEmailVerified: Joi.boolean().default(false).messages(getMessages('isEmailVerified', 'boolean')),
      first_name: Joi.string().messages(getMessages('नाम', 'string')),
      last_name: Joi.string().messages(getMessages('थर', 'string')),
      image: Joi.string().messages(getMessages('Photo', 'string')),
      phone: Joi.string().messages(getMessages('Phone no.', 'string')),
      ward: Joi.string().custom(objectId).messages(getMessages('Ward', 'string')),
      status: Joi.string().valid('active', 'inactive', 'not_verified'),
      organization: Joi.alternatives().conditional('role', [
        {
          is: 'organizationAdmin',
          then: Joi.string().required().custom(objectId).messages(getMessages('Organization', 'string')),
        },
      ]),
    })
    .min(1),
};

const updateMe = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().messages(getMessages('ईमेल', 'string')),
      password: Joi.string().custom(password).messages(getMessages('Password', 'string')),
      username: Joi.string().messages(getMessages('Username', 'string')),
      isEmailVerified: Joi.boolean().default(false).messages(getMessages('isEmailVerified', 'boolean')),
      first_name: Joi.string().messages(getMessages('नाम', 'string')),
      last_name: Joi.string().messages(getMessages('थर', 'string')),
      image: Joi.string().messages(getMessages('Photo', 'string')),
      phone: Joi.string().messages(getMessages('Phone no.', 'string')),
    })
    .min(1),
};

const deleteUser = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
};
