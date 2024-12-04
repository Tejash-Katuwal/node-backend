const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getClasss = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
  }),
};

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    grade_text: Joi.string().required(),
    section_text: Joi.string().required(),
    organization: Joi.string().custom(objectId).required(),
  }),
};

const getClass = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateClass = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      grade_text: Joi.string(),
      section_text: Joi.string(),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteClass = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getClasss,
  createClass,
  getClass,
  updateClass,
  deleteClass,
};
