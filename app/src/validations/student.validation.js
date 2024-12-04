const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getStudents = {
  query: Joi.object().keys({
    sortBy: Joi.string().default('roll_no:asc'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    department: Joi.string().custom(objectId),
    class: Joi.string().custom(objectId),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
    name: Joi.string(),
    type: Joi.string().valid('all', 'present', 'absent').default('all'),
  }),
};

const createStudent = {
  body: Joi.object().keys({
    validity: Joi.string().required(),
    card_number: Joi.string().required(),
    shift: Joi.string().required(),
    grade: Joi.string().custom(objectId),
    roll_no: Joi.string().allow(''),
    date_of_birth_ad: Joi.string().allow(''),
    date_of_birth_bs: Joi.string().allow(''),
    department: Joi.string().custom(objectId).allow(''),
    address: Joi.string().allow(''),
    father_name: Joi.string().allow(''),
    mother_name: Joi.string().allow(''),
    guardian_name: Joi.string().allow(''),
    guardian_phone: Joi.string().allow(''),
    guardian_email: Joi.string().allow(''),
    email: Joi.string().required(),
    password: Joi.string().allow(''),
    role: Joi.string().required().allow(''),
    first_name: Joi.string().allow(''),
    last_name: Joi.string().allow(''),
    image: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    ward: Joi.string().allow(''),
    fiscal: Joi.string().allow(''),
    authMethod: Joi.string().allow(''),
    organization: Joi.string().required().custom(objectId),
  }),
};

const getStudent = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateStudent = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      validity: Joi.string().allow(''),
      card_number: Joi.string().allow(''),
      shift: Joi.string().allow(''),
      grade: Joi.string().custom(objectId).allow(''),
      roll_no: Joi.string().allow(''),
      // section: Joi.string(),
      date_of_birth_ad: Joi.string().allow(''),
      date_of_birth_bs: Joi.string().allow(''),
      department: Joi.string().custom(objectId).allow(''),
      address: Joi.string().allow(''),
      father_name: Joi.string().allow(''),
      mother_name: Joi.string().allow(''),
      guardian_name: Joi.string().allow(''),
      guardian_phone: Joi.string().allow(''),
      guardian_email: Joi.string().allow(''),
      username: Joi.string().allow(''),
      email: Joi.string().allow(''),
      password: Joi.string().allow(''),
      role: Joi.string().allow(''),
      first_name: Joi.string().allow(''),
      last_name: Joi.string().allow(''),
      image: Joi.string().allow(''),
      phone: Joi.string().allow(''),
      ward: Joi.string().allow(''),
      fiscal: Joi.string().allow(''),
      status: Joi.string().valid('active', 'inactive', 'not_verified'),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteStudent = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
};
