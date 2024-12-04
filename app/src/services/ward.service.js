const httpStatus = require('http-status');
const Ward = require('../models/ward.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a ward
 * @param {Object} wardBody
 * @returns {Promise<Ward>}
 */
const createWard = async (wardBody, session) => {
  if (session) return Ward.create(wardBody, session);
  return Ward.create(wardBody);
};

/**
 * Query for wards
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWards = async (filter, options) => {
  const wards = await Ward.paginate(filter, options);
  return wards;
};

/**
 * Get ward by id
 * @param {ObjectId} id
 * @returns {Promise<Ward>}
 */
const getWardById = async (id) => {
  return Ward.findById(id);
};

/**
 * Update ward by id
 * @param {ObjectId} wardId
 * @param {Object} updateBody
 * @returns {Promise<Ward>}
 */
const updateWardById = async (wardId, updateBody) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ward भेटिएन । ');
  }
  Object.assign(ward, updateBody);
  await ward.save();
  return ward;
};

/**
 * Update ward by id
 * @param {ObjectId} wardId
 * @param {Object} updateBody
 * @returns {Promise<Ward>}
 */
const updateWardByMQId = async (wardId, updateBody) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    return null;
  }
  Object.assign(ward, updateBody);
  await ward.save();
  return ward;
};

/**
 * Delete ward by id
 * @param {ObjectId} wardId
 * @returns {Promise<Ward>}
 */
const deleteWardById = async (wardId) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ward भेटिएन । ');
  }
  await ward.remove();
  return ward;
};

/**
 * Delete ward by id
 * @param {ObjectId} wardId
 * @returns {Promise<Ward>}
 */
const deleteWardByMQId = async (wardId) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    return null;
  }
  await ward.remove();
  return ward;
};

module.exports = {
  createWard,
  queryWards,
  getWardById,
  updateWardById,
  deleteWardById,
  updateWardByMQId,
  deleteWardByMQId,
};
