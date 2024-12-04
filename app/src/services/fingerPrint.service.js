const httpStatus = require('http-status');
const FingerPrint = require('../models/fingerPrint.model');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Create a fingerPrint
 * @param {Object} body
 * @returns {Promise<FingerPrint>}
 */
const createFingerPrint = (body, url) => {
  const { fingerPrint, applicant } = { ...body };
  const fingerPrintBody = [];
  for (let index = 0; index < fingerPrint.length; index++) {
    const element = fingerPrint[index];
    const fileName = `${Date.now()}.png`;
    if (element.image) {
      const base64 = element.image.replace(/^data:.+;base64,/, '');
      const buffer = new Buffer.from(base64, 'base64');
      fs.writeFileSync(`${__dirname}/../../uploads/${fileName}`, buffer);
    }
    fingerPrintBody.push({ ...element, image: element.image ? url + fileName : '' });
  }

  return FingerPrint.create({ fingerPrint: fingerPrintBody, applicant });
};

/**
 * Query for fingerPrint
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFingerPrints = async (filter, options) => {
  const fingerPrint = await FingerPrint.paginate(filter, options);
  return fingerPrint;
};

/**
 * Get fingerPrint by id
 * @param {ObjectId} id
 * @returns {Promise<FingerPrint>}
 */
const getFingerPrintById = async (id) => {
  return FingerPrint.findById(id);
};

/**
 * Update fingerPrint by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<FingerPrint>}
 */
const updateFingerPrintById = async (id, updateBody, options = {}) => {
  const fingerPrint = await getFingerPrintById(id);
  if (!fingerPrint) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FingerPrint भेटिएन । ');
  }
  Object.assign(fingerPrint, updateBody);

  return fingerPrint.save();
};

/**
 * Delete fingerPrint by id
 * @param {ObjectId} id
 * @returns {Promise<FingerPrint>}
 */
const deleteFingerPrintById = async (id) => {
  const fingerPrint = await getFingerPrintById(id);
  if (!fingerPrint) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FingerPrint भेटिएन । ');
  }
  await fingerPrint.remove();
  return fingerPrint;
};

const getFingerPrintByApplicantId = async (id) => {
  const fingerPrint = await FingerPrint.aggregate([
    { $match: { applicant: mongoose.Types.ObjectId(id) } },
    { $unwind: { path: '$fingerPrint' } },
    {
      $group: {
        _id: '',
        fingerPrint: { $push: '$fingerPrint' },
        type: { $first: '$type' },
        applicant: { $first: '$applicant' },
      },
    },
  ]);
  return fingerPrint;
};

module.exports = {
  createFingerPrint,
  queryFingerPrints,
  getFingerPrintById,
  updateFingerPrintById,
  deleteFingerPrintById,
  getFingerPrintByApplicantId,
};
