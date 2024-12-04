const Joi = require('joi');
const { objectId, password, getMessages } = require('./custom.validation');

const createWard = {
  body: Joi.object().keys({
    nagarpalika: Joi.string().custom(objectId).required().messages(getMessages('Nagarpalika', 'string')),
    username: Joi.string().required().messages(getMessages('Username', 'string')),
    ward_np: Joi.string().required().messages(getMessages('वडा नम्बर', 'string')),
    ward_en: Joi.string().required().messages(getMessages('Ward Number', 'string')),
    email: Joi.string().email().required().messages(getMessages('ईमेल', 'string')),
    phone_np: Joi.string().required().messages(getMessages('Phone No.(Nepali)', 'string')),
    phone_en: Joi.string().required().messages(getMessages('Phone No.(English)', 'string')),
    address_np: Joi.string().required().messages(getMessages('Address(Nepali)', 'string')),
    address_en: Joi.string().required().messages(getMessages('Address(English)', 'string')),
    main_logo: Joi.string().allow('').messages(getMessages('Main Logo', 'string')),
    campaign_logo: Joi.string().allow('').messages(getMessages('Campaign Logo', 'string')),
    ward_admin: Joi.object().keys({
      role: Joi.string().valid('ward_admin').default('ward_admin').messages(getMessages('भूमिका', 'string')),
      email: Joi.string().required().email().messages(getMessages('ईमेल', 'string')),
      password: Joi.string().required().custom(password).messages(getMessages('Password', 'string')),
      username: Joi.string().required().messages(getMessages('Username', 'string')),
      designation_en: Joi.string().messages(getMessages('Designation', 'string')),
      designation_np: Joi.string().messages(getMessages('पद', 'string')),
      fullname_en: Joi.string().required().messages(getMessages('पुरा नाम (अंग्रेजीमा)', 'string')),
      fullname_np: Joi.string().required().messages(getMessages('पुरा नाम (नेपालीमा)', 'string')),
      image: Joi.string().messages(getMessages('Photo', 'string')),
      phone_en: Joi.string().required().messages(getMessages('Phone no.(अंग्रेजीमा)', 'string')),
      phone_np: Joi.string().required().messages(getMessages('Phone no.(नेपालीमा)', 'string')),
    }),
    ward_user: Joi.object().keys({
      role: Joi.string().valid('ward_user').default('ward_user').messages(getMessages('भूमिका', 'string')),
      email: Joi.string().required().email().messages(getMessages('ईमेल', 'string')),
      password: Joi.string().required().custom(password).messages(getMessages('Password', 'string')),
      username: Joi.string().required().messages(getMessages('Username', 'string')),
      designation_en: Joi.string().messages(getMessages('Designation', 'string')),
      designation_np: Joi.string().messages(getMessages('पद', 'string')),
      fullname_en: Joi.string().required().messages(getMessages('पुरा नाम (अंग्रेजीमा)', 'string')),
      fullname_np: Joi.string().required().messages(getMessages('पुरा नाम (नेपालीमा)', 'string')),
      image: Joi.string().messages(getMessages('Photo', 'string')),
      phone_en: Joi.string().required().messages(getMessages('Phone no.(अंग्रेजीमा)', 'string')),
      phone_np: Joi.string().required().messages(getMessages('Phone no.(नेपालीमा)', 'string')),
    }),
  }),
};

const getWards = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
  }),
};

const getWard = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const updateWard = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      nagarpalika: Joi.string().custom(objectId).messages(getMessages('Nagarpalika', 'string')),
      username: Joi.string().messages(getMessages('Username', 'string')),
      ward_np: Joi.string().messages(getMessages('वडा नम्बर', 'string')),
      ward_en: Joi.string().messages(getMessages('Ward Number', 'string')),
      email: Joi.string().email().messages(getMessages('ईमेल', 'string')),
      phone_np: Joi.string().messages(getMessages('Phone No.(Nepali)', 'string')),
      phone_en: Joi.string().messages(getMessages('Phone No.(English)', 'string')),
      address_np: Joi.string().messages(getMessages('Address(Nepali)', 'string')),
      address_en: Joi.string().messages(getMessages('Address(English)', 'string')),
      main_logo: Joi.string().messages(getMessages('Main Logo', 'string')),
      campaign_logo: Joi.string().messages(getMessages('Campaign Logo', 'string')),
    })
    .min(1),
};

const deleteWard = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

module.exports = {
  createWard,
  getWards,
  getWard,
  updateWard,
  deleteWard,
};
