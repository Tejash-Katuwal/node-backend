const httpStatus = require('http-status');
const Device = require('../models/device.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for device
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getDevices = async (filter = {}, options = {}) => {
  const device = await Device.paginate(filter, options);
  return device;
};

/**
 * Create a Device
 * @param {Object} deviceBody
 * @returns {Promise<Device>}
 */
const createDevice = async (deviceBody) => {
  const createdDevice = await Device.create(deviceBody);

  return createdDevice;
};

/**
 * Get Device by id
 * @param {ObjectId} id
 * @returns {Promise<Device>}
 */
const getDeviceById = async (id, organization) => {
  if (organization) {
    return Device.findOne({ _id: id, organization });
  }
  return Device.findById(id);
};

const getDeviceBySerialNumber = async (serial_number) => {
  return Device.findOne({ serial_number });
};

/**
 * Get Device by id
 * @param {ObjectId} id
 * @returns {Promise<Device>}
 */
const getDeviceBySN = async (id) => {
  return Device.findOne({ serial_number: id });
};

/**
 * Update Device by id
 * @param {ObjectId} DeviceId
 * @param {Object} updateBody
 * @returns {Promise<Device>}
 */
const updateDeviceById = async (deviceId, updateBody, organization) => {
  const device = await getDeviceById(deviceId, organization);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device फेला परेन');
  }

  Object.assign(device, updateBody);
  await device.save();
  return device;
};

/**
 * Update Device by id
 * @param {ObjectId} DeviceId
 * @param {Object} updateBody
 * @returns {Promise<Device>}
 */
const updateDeviceINFOBySN = async (deviceId, updateBody) => {
  const device = await getDeviceBySN(deviceId);

  if (!device) {
    return;
  }
  Object.assign(device, updateBody);
  await device.save();
  return device;
};

/**
 * Delete device by id
 * @param {ObjectId} deviceId
 * @returns {Promise<ANM>}
 */
const deleteDeviceById = async (deviceId, organization) => {
  const device = await getDeviceById(deviceId, organization);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device फेला परेन');
  }
  await device.remove();
  return device;
};

module.exports = {
  getDevices,
  createDevice,
  getDeviceById,
  updateDeviceById,
  deleteDeviceById,
  updateDeviceINFOBySN,
  getDeviceBySerialNumber,
};
