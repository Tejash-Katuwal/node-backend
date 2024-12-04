const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAttendanceLogs = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    grade: Joi.string().custom(objectId),
    noPagination: Joi.boolean().default(true),
    role: Joi.string().valid('student', 'employee', 'teacher'),
    from: Joi.string(),
    to: Joi.string(),
    organization: Joi.string().custom(objectId),
  }),
};

const createAttendanceLog = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    time: Joi.string().required(),
    status: Joi.string(),
    verify: Joi.string(),
    workcode: Joi.string(),
    IDNum: Joi.string(),
    type: Joi.string(),
    organization: Joi.string().required().custom(objectId),
  }),
};

const getAttendanceLog = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateAttendanceLog = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string(),
      time: Joi.string(),
      status: Joi.string(),
      verify: Joi.string(),
      workcode: Joi.string(),
      IDNum: Joi.string(),
      type: Joi.string(),
    })
    .min(1),
};

const deleteAttendanceLog = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getAttendanceLogs,
  createAttendanceLog,
  getAttendanceLog,
  updateAttendanceLog,
  deleteAttendanceLog,
};
