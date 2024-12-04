const httpStatus = require('http-status');
const TempUser = require('../models/tempUser.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for tempUser
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getTempUsers = async (filter, options) => {
  const tempUser = await TempUser.paginate(filter, options);
  return tempUser;
};

/**
 * Create a TempUser
 * @param {Object} tempUserBody
 * @returns {Promise<TempUser>}
 */
const createTempUser = async (tempUserBody) => {
  const createdTempUser = await TempUser.create(tempUserBody);

  return createdTempUser;
};

/**
 * Get TempUser by id
 * @param {ObjectId} id
 * @returns {Promise<TempUser>}
 */
const getTempUserById = async (id) => {
  return TempUser.findById(id);
};

/**
 * Update TempUser by id
 * @param {ObjectId} TempUserId
 * @param {Object} updateBody
 * @returns {Promise<TempUser>}
 */
const updateTempUserById = async (tempUserId, updateBody) => {
  const tempUser = await getTempUserById(tempUserId);
  if (!tempUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TempUser फेला परेन');
  }

  Object.assign(tempUser, updateBody);
  await tempUser.save();
  return tempUser;
};

/**
 * Delete tempUser by id
 * @param {ObjectId} tempUserId
 * @returns {Promise<ANM>}
 */
const deleteTempUserById = async (tempUserId) => {
  const tempUser = await getTempUserById(tempUserId);
  if (!tempUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TempUser फेला परेन');
  }
  await tempUser.remove();
  return tempUser;
};

module.exports = {
  getTempUsers,
  createTempUser,
  getTempUserById,
  updateTempUserById,
  deleteTempUserById,
};
