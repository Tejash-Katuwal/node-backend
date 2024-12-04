const httpStatus = require('http-status');
const FiscalYear = require('../models/fiscalyear.model');
const redisClient = require('../redis-client');
const ApiError = require('../utils/ApiError');

/**
 * Create a fiscalyear
 * @param {Object} body
 * @returns {Promise<FiscalYear>}
 */
const createFiscalYear = async (body) => {
  const fiscalYear = await FiscalYear.create(body);
  if (fiscalYear.is_active === true) {
    await redisClient.set('fiscalYear', JSON.stringify(fiscalYear));
  }
  return fiscalYear;
};

const createMissingFiscalYears = async (data = []) => {
  const fiscalsTitles = data.map((d) => d.fiscal).filter((d) => d);
  if (fiscalsTitles.length) {
    const uniqueFiscalsTitles = [...new Set(fiscalsTitles)];
    const availables = await getFiscalYearByTitle(uniqueFiscalsTitles);
    const availablesTitles = new Set(availables.map((a) => a.title));
    const unavailableTitles = uniqueFiscalsTitles.filter((title) => {
      return !availablesTitles.has(title);
    });
    let unavailables = [];
    if (unavailableTitles.length) {
      unavailables = await createMultipleFiscalYear(unavailableTitles.map((title) => ({ title, is_active: false })));
    }
    const allFiscalYear = [...availables, ...unavailables];
    const objectification = {};
    allFiscalYear.forEach((fiscal) => (objectification[fiscal.title] = fiscal._id));
    const dataWithFiscal = data.map((d) => ({ ...d, fiscal: objectification[d.fiscal] }));
    return dataWithFiscal;
  }
  return data;
};

/**
 * Create a fiscalyear
 * @param {Object} body
 * @returns {Promise<FiscalYear>}
 */
const createMultipleFiscalYear = async (body = []) => {
  const fiscalYear = await FiscalYear.insertMany(body);
  return fiscalYear;
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
const queryFiscalYears = async (filter, options) => {
  const wards = await FiscalYear.paginate(filter, options);
  return wards;
};

/**
 * Get fiscalyear by id
 * @param {ObjectId} id
 * @returns {Promise<FiscalYear>}
 */
const getFiscalYearById = async (id) => {
  return FiscalYear.findById(id);
};

/**
 * Get fiscalyear by id
 * @param {ObjectId} id
 * @returns {Promise<FiscalYear>}
 */
const getFiscalYearByTitle = async (titles = []) => {
  return FiscalYear.find({ title: { $in: titles } });
};

/**
 * Get fiscalyear is_active
 * @returns {Promise<FiscalYear>}
 */
const getActiveFiscalYear = async () => {
  let cache = false;
  let fiscalYear;
  const fiscalYearData = await redisClient.get('fiscalYear');
  if (fiscalYearData) {
    fiscalYear = JSON.parse(fiscalYearData);
    cache = true;
  } else {
    fiscalYear = await FiscalYear.findOne({ is_active: true });
    await redisClient.set('fiscalYear', JSON.stringify(fiscalYear));
  }
  return { data: fiscalYear, cache };
};

/**
 * Update fiscalyear by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<FiscalYear>}
 */
const updateFiscalYearById = async (id, updateBody) => {
  const fiscalyear = await getFiscalYearById(id);
  if (!fiscalyear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FiscalYear भेटिएन । ');
  }
  Object.assign(fiscalyear, updateBody);
  await fiscalyear.save();
  if (fiscalyear.is_active === true) {
    await redisClient.set('fiscalYear', JSON.stringify(fiscalyear));
  }
  return fiscalyear;
};

/**
 * Update fiscalyear by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<FiscalYear>}
 */
const updateFiscalYearByMQid = async (id, updateBody) => {
  const fiscalyear = await FiscalYear.findOne({ id });

  if (!fiscalyear) {
    return null;
  }
  Object.assign(fiscalyear, updateBody);
  await fiscalyear.save();
  if (fiscalyear.is_active === true) {
    await redisClient.set('fiscalYear', JSON.stringify(fiscalyear));
  }
  return fiscalyear;
};

/**
 * Delete fiscalyear by id
 * @param {ObjectId} id
 * @returns {Promise<FiscalYear>}
 */
const deleteFiscalYearById = async (id) => {
  const fiscalyear = await getFiscalYearById(id);
  if (!fiscalyear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FiscalYear भेटिएन । ');
  }
  if (fiscalyear.is_active) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete is_active fiscal year!');
  }
  await fiscalyear.remove();
  return fiscalyear;
};

/**
 * Delete fiscalyear by id
 * @param {ObjectId} id
 * @returns {Promise<FiscalYear>}
 */
const deleteFiscalYearByMQId = async (id) => {
  const fiscalyear = await getFiscalYearById(id);

  if (!fiscalyear) {
    return null;
  }
  if (fiscalyear.is_active) {
    return null;
  }
  await fiscalyear.remove();
  return fiscalyear;
};

module.exports = {
  createFiscalYear,
  queryFiscalYears,
  getFiscalYearById,
  updateFiscalYearById,
  updateFiscalYearByMQid,
  deleteFiscalYearById,
  deleteFiscalYearByMQId,
  getActiveFiscalYear,
  getFiscalYearByTitle,
  createMultipleFiscalYear,
  createMissingFiscalYears,
};
