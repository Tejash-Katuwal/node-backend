const Joi = require('joi');
const { DEVICEPLATFORM } = require('../config/enum');

const createMobile = {
  body: Joi.object().keys({
    mobileId: Joi.string().required(),
    pushTokenId: Joi.string().required(),
    platform: Joi.string()
      .required()
      .valid(...DEVICEPLATFORM.ENUM),
  }),
};

const deleteMobile = {
  params: Joi.object().keys({
    mobileId: Joi.string().required(),
  }),
};

module.exports = {
  createMobile,
  deleteMobile,
};
