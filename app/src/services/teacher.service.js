const httpStatus = require('http-status');
const Teacher = require('../models/teacher.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for teacher
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getTeachers = async (filter, options) => {
  const teacher = await Teacher.paginate(filter, options);
  return teacher;
};

/**
 * Create a Teacher
 * @param {Object} teacherBody
 * @returns {Promise<Teacher>}
 */
const createTeacher = async (teacherBody) => {
  const createdTeacher = await Teacher(teacherBody);

  return createdTeacher;
};

/**
 * Get Teacher by id
 * @param {ObjectId} id
 * @returns {Promise<Teacher>}
 */
const getTeacherById = async (id, organization, populate) => {
  if (populate) {
    if (organization) {
      return Teacher.findOne({ _id: id, organization }).populate(populate);
    }
    return Teacher.findById(id).populate(populate);
  } else if (organization) {
    return Teacher.findOne({ _id: id, organization });
  }
  return Teacher.findById(id);
};

/**
 * Update Teacher by id
 * @param {ObjectId} TeacherId
 * @param {Object} updateBody
 * @returns {Promise<Teacher>}
 */
const updateTeacherById = async (teacherId, updateBody, organization) => {
  const teacher = await getTeacherById(teacherId, organization);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher फेला परेन');
  }

  Object.assign(teacher, updateBody);
  await teacher.save();
  return teacher;
};

/**
 * Delete teacher by id
 * @param {ObjectId} teacherId
 * @returns {Promise<ANM>}
 */
const deleteTeacherById = async (teacherId, organization) => {
  const teacher = await getTeacherById(teacherId, organization);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher फेला परेन');
  }
  await teacher.remove();
  return teacher;
};

module.exports = {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacherById,
  deleteTeacherById,
};
