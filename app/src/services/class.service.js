const httpStatus = require('http-status');
const Class = require('../models/class.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for class
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getClasss = async (filter, options) => {
  const newClass = await Class.paginate(filter, options);
  return newClass;
};

/**
 * Create a Class
 * @param {Object} classBody
 * @returns {Promise<Class>}
 */
const createClass = async (classBody) => {
  const createdClass = await Class.create(classBody);

  return createdClass;
};

/**
 * Get Class by id
 * @param {ObjectId} id
 * @returns {Promise<Class>}
 */
const getClassById = async (id, organization) => {
  if (organization) {
    return Class.findOne({ _id: id, organization });
  }
  return Class.findById(id);
};

/**
 * Get Class by id
 * @param {ObjectId} id
 * @returns {Promise<Class>}
 */
const getClassByClassNumber = async (classNumber, section = 'A') => {
  return Class.findOne({ grade_text: classNumber, section_text: section });
};

/**
 * Update Class by id
 * @param {ObjectId} ClassId
 * @param {Object} updateBody
 * @returns {Promise<Class>}
 */
const updateClassById = async (classId, updateBody, organization) => {
  const newClass = await getClassById(classId, organization);
  if (!newClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class फेला परेन');
  }

  Object.assign(newClass, updateBody);
  await newClass.save();
  return newClass;
};

/**
 * Delete class by id
 * @param {ObjectId} classId
 * @returns {Promise<ANM>}
 */
const deleteClassById = async (classId, organization) => {
  const newClass = await getClassById(classId, organization);
  if (!newClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class फेला परेन');
  }
  await newClass.remove();
  return newClass;
};

module.exports = {
  getClasss,
  createClass,
  getClassById,
  updateClassById,
  deleteClassById,
  getClassByClassNumber,
};
