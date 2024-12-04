const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAttendanceReport = {
  query: Joi.object().keys({
    grade: Joi.string().custom(objectId),
    section: Joi.string(),
    role: Joi.string().valid('student', 'employee', 'teacher'),
    department: Joi.string().custom(objectId),
    organization: Joi.string().custom(objectId),
    month: Joi.string(),
    year: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
  }),
};

const getAbsenceReport = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
    grade: Joi.string().custom(objectId),
    section: Joi.string(),
    role: Joi.string().valid('student', 'employee', 'teacher'),
    department: Joi.string().custom(objectId),
    from: Joi.string(),
    to: Joi.string(),
  }),
};

const getAttendanceReportIndividual = {
  params: {
    id: Joi.string().required().custom(objectId),
  },
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
    organization: Joi.string().custom(objectId),
    from: Joi.string(),
    to: Joi.string(),
    limit: Joi.number().integer().default(10),
    page: Joi.number().integer().default(1),
  }),
};

const getAttendanceMe = {
  query: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    from: Joi.string(),
    to: Joi.string(),
    limit: Joi.number().integer().default(10),
    page: Joi.number().integer().default(1),
    stats: Joi.boolean().default(false),
    grade: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getAttendanceReport,
  getAttendanceReportIndividual,
  getAbsenceReport,
  getAttendanceMe,
};
