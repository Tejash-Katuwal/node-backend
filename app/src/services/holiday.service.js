const httpStatus = require('http-status');
const Holiday = require('../models/holiday.model');
const ApiError = require('../utils/ApiError');
const { getDatesBetween } = require('./calendar.service');

/**
 * Query for holiday
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getHolidays = async (filter, options) => {
  const holiday = await Holiday.paginate(filter, options);
  return holiday;
};

const getHolidaysDatesByFilter = async (filter) => {
  const holiday = await Holiday.find(filter).select('dates -_id').lean();
  const dates = holiday
    .map((holiday) => holiday.dates)
    .flat()
    .sort();
  return dates;
};

/**
 * Create a Holiday
 * @param {Object} holidayBody
 * @returns {Promise<Holiday>}
 */
const createHoliday = async (holidayBody) => {
  const createdHoliday = await Holiday.create(holidayBody);

  return createdHoliday;
};

/**
 * Get Holiday by id
 * @param {ObjectId} id
 * @returns {Promise<Holiday>}
 */
const getHolidayById = async (id, organization) => {
  if (organization) {
    return Holiday.findOne({ _id: id, organization });
  }
  return Holiday.findById(id);
};

/**
 * Update Holiday by id
 * @param {ObjectId} HolidayId
 * @param {Object} updateBody
 * @returns {Promise<Holiday>}
 */
const updateHolidayById = async (holidayId, updateBody, organization) => {
  const holiday = await getHolidayById(holidayId, organization);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Holiday फेला परेन');
  }
  updateBody.dates = getDatesBetween(holiday.startDate, holiday.endDate);
  Object.assign(holiday, updateBody);
  await holiday.save();
  return holiday;
};

/**
 * Delete holiday by id
 * @param {ObjectId} holidayId
 * @returns {Promise<ANM>}
 */
const deleteHolidayById = async (holidayId, organization) => {
  const holiday = await getHolidayById(holidayId, organization);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Holiday फेला परेन');
  }
  await holiday.remove();
  return holiday;
};

module.exports = {
  getHolidays,
  createHoliday,
  getHolidayById,
  updateHolidayById,
  deleteHolidayById,
  getHolidaysDatesByFilter,
};
