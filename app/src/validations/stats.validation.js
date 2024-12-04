const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getStats = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getStats,
};
