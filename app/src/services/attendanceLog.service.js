const httpStatus = require('http-status');
const AttendanceLog = require('../models/attendanceLog.model');
const ApiError = require('../utils/ApiError');
const calendarService = require('./calendar.service');

/**
 * Query for attendanceLog
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAttendanceLogs = async (filter, options) => {
  const attendanceLog = await AttendanceLog.paginate(filter, options);
  return attendanceLog;
};

const getTodayPresentUserIds = async (filter = {}) => {
  const today = calendarService.getCurrentDate();
  return await AttendanceLog.count({
    date: { $regex: today, $options: 'i' },
    ...filter,
  }).distinct('userId');
};

/**
 * Create a AttendanceLog
 * @param {Object} attendanceLogBody
 * @returns {Promise<AttendanceLog>}
 */
const createAttendanceLog = async (attendanceLogBody) => {
  const createdAttendanceLog = await AttendanceLog.create(attendanceLogBody);

  return createdAttendanceLog;
};

/**
 * Get AttendanceLog by id
 * @param {ObjectId} id
 * @returns {Promise<AttendanceLog>}
 */
const getAttendanceLogById = async (id, organization) => {
  if (organization) {
    return AttendanceLog.findOne({ _id: id, organization });
  }
  return AttendanceLog.findById(id);
};

/**
 * Update AttendanceLog by id
 * @param {ObjectId} AttendanceLogId
 * @param {Object} updateBody
 * @returns {Promise<AttendanceLog>}
 */
const updateAttendanceLogById = async (attendanceLogId, updateBody, organization) => {
  const attendanceLog = await getAttendanceLogById(attendanceLogId, organization);
  if (!attendanceLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AttendanceLog फेला परेन');
  }

  Object.assign(attendanceLog, updateBody);
  await attendanceLog.save();
  return attendanceLog;
};

/**
 * Delete attendanceLog by id
 * @param {ObjectId} attendanceLogId
 * @returns {Promise<ANM>}
 */
const deleteAttendanceLogById = async (attendanceLogId, organization) => {
  const attendanceLog = await getAttendanceLogById(attendanceLogId, organization);
  if (!attendanceLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AttendanceLog फेला परेन');
  }
  await attendanceLog.remove();
  return attendanceLog;
};

module.exports = {
  getAttendanceLogs,
  createAttendanceLog,
  getAttendanceLogById,
  updateAttendanceLogById,
  deleteAttendanceLogById,
  getTodayPresentUserIds,
};
