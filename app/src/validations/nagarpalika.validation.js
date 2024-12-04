const Joi = require('joi');
const { getMessages } = require('./custom.validation');

const updateNagarpalika = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages(getMessages('Email', 'string')),
    name_np: Joi.string().required().messages(getMessages('Name(Nepali)', 'string')),
    name_en: Joi.string().required().messages(getMessages('Name(English)', 'string')),
    address_np: Joi.string().required().messages(getMessages('Address(Nepali)', 'string')),
    address_en: Joi.string().required().messages(getMessages('Address(English)', 'string')),
    district_np: Joi.string().required().messages(getMessages('District(Nepali)', 'string')),
    district_en: Joi.string().required().messages(getMessages('District(English)', 'string')),
    phone_np: Joi.string().required().messages(getMessages('Phone no.(Nepali)', 'string')),
    phone_en: Joi.string().required().messages(getMessages('Phone no.(English)', 'string')),
    province_np: Joi.string().required().messages(getMessages('Province(Nepali)', 'string')),
    province_en: Joi.string().required().messages(getMessages('Province(English)', 'string')),
    slogan_np: Joi.string().required().messages(getMessages('Slogan.(Nepali)', 'string')),
    slogan_en: Joi.string().required().messages(getMessages('Slogan.(English)', 'string')),
    main_logo: Joi.string().allow('').messages(getMessages('Main Logo', 'string')),
    campaign_logo: Joi.string().allow('').messages(getMessages('Campaign Logo', 'string')),
  }),
};

module.exports = {
  updateNagarpalika,
};
