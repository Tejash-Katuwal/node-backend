const httpStatus = require('http-status');
const Shift = require('../models/shift.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for shift
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getShifts = async (filter, options) => {
  const shift = await Shift.paginate(filter, options);
  return shift;
};

/**
 * Create a Shift
 * @param {Object} shiftBody
 * @returns {Promise<Shift>}
 */
const createShift = async (shiftBody) => {
  const createdShift = await Shift.create(shiftBody);

  return createdShift;
};

/**
 * Get Shift by id
 * @param {ObjectId} id
 * @returns {Promise<Shift>}
 */
const getShiftById = async (id, organization) => {
  if (organization) {
    return Shift.findOne({ _id: id, organization });
  }
  return Shift.findById(id);
};

/**
 * Update Shift by id
 * @param {ObjectId} ShiftId
 * @param {Object} updateBody
 * @returns {Promise<Shift>}
 */
const updateShiftById = async (shiftId, updateBody, organization) => {
  const shift = await getShiftById(shiftId, organization);
  if (!shift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shift फेला परेन');
  }

  Object.assign(shift, updateBody);
  await shift.save();
  return shift;
};

/**
 * Delete shift by id
 * @param {ObjectId} shiftId
 * @returns {Promise<ANM>}
 */
const deleteShiftById = async (shiftId, organization) => {
  const shift = await getShiftById(shiftId, organization);
  if (!shift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shift फेला परेन');
  }
  await shift.remove();
  return shift;
};

module.exports = {
  getShifts,
  createShift,
  getShiftById,
  updateShiftById,
  deleteShiftById,
};
