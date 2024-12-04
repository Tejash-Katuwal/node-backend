const Joi = require('joi');
const { password, getMessages } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages(getMessages('इमेल', 'string')),
    password: Joi.string().required().custom(password).messages(getMessages('पासवर्ड', 'string')),
    name: Joi.string().required().messages(getMessages('नाम', 'string')),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required().messages(getMessages('इमेल', 'string')),
    password: Joi.string().required().messages(getMessages('पासवर्ड', 'string')),
  }),
};

const loginStudent = {
  body: Joi.object().keys({
    phone: Joi.string().required().messages(getMessages('phone', 'string')),
    date_of_birth: Joi.string().required().messages(getMessages('date of birth', 'string')),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  loginStudent,
};
