const httpStatus = require('http-status');
const Student = require('../models/student.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for student
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getStudents = async (filter, options) => {
  const student = await Student.paginate(filter, options);
  return student;
};

/**
 * Create a Student
 * @param {Object} studentBody
 * @returns {Promise<Student>}
 */
const createStudent = async (studentBody) => {
  const createdStudent = await Student(studentBody);

  return createdStudent;
};

/**
 * Get Student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const getStudentById = async (id, organization, populate) => {
  if (populate) {
    if (organization) {
      return Student.findOne({ _id: id, organization }).populate(populate);
    }
    return Student.findById(id).populate(populate);
  } else if (organization) {
    return Student.findOne({ _id: id, organization });
  }
  return Student.findById(id);
};

const getStudentsUserIdsByGrade = async (grade) => {
  return Student.find({ grade }).select('userId -_id');
};

const getUserByPhoneAndDOB = async (phone) => {
  return Student.find({ phone });
};

/**
 * Update Student by id
 * @param {ObjectId} StudentId
 * @param {Object} updateBody
 * @returns {Promise<Student>}
 */
const updateStudentById = async (studentId, updateBody, organization) => {
  const student = await getStudentById(studentId, organization);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student फेला परेन');
  }

  Object.assign(student, updateBody);
  await student.save();
  return student;
};

/**
 * Delete student by id
 * @param {ObjectId} studentId
 * @returns {Promise<ANM>}
 */
const deleteStudentById = async (studentId, organization) => {
  const student = await getStudentById(studentId, organization);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student फेला परेन');
  }
  await student.remove();
  return student;
};

module.exports = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  getStudentsUserIdsByGrade,
  getUserByPhoneAndDOB,
};
