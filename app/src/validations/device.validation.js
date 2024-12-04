const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getDevices = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    type: Joi.string().valid('rfid', 'zkteco'),
    noPagination: Joi.boolean().default(true),
    organization: Joi.string().custom(objectId),
  }),
};

const createDevice = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    serial_number: Joi.string().required(),
    type: Joi.string().valid('rfid', 'zkteco').required(),
    organization: Joi.string().custom(objectId).required(),
    config: Joi.alternatives().conditional('type', [
      {
        is: 'rfid',
        then: Joi.object({
          baudrate: Joi.string().required(),
          type: Joi.string().required(),
          protocol: Joi.string().required(),
          address: Joi.string().required(),
          power: Joi.string().required(),
          max_scan_time: Joi.string().required(),
          min_frequency: Joi.string().required(),
          max_frequency: Joi.string().required(),
          mode: Joi.number().required(),
          version: Joi.string().required(),
          sub_version: Joi.string().required(),
        }),
      },
      {
        is: 'zkteco',
        then: Joi.object({
          language: Joi.string(),
          Firmware: Joi.string(),
          noOfUsers: Joi.string(),
          noOfFingerprints: Joi.string(),
          noOfAttendanceRecords: Joi.string(),
          IP: Joi.string(),
          versionOfFPAlg: Joi.string(),
          VersionOfFaceALG: Joi.string(),
          numberOfFacesRequired: Joi.string(),
          numberOfEnrolledFaces: Joi.string(),
          supportedDevices: Joi.string(),
          options: Joi.string(),
          pushver: Joi.string(),
        }),
      },
    ]),
  }),
};

const getDevice = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const syncDevice = {
  params: Joi.object().keys({
    serial_number: Joi.string().required(),
  }),
};

const updateDevice = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      baudrate: Joi.string(),
      serial_number: Joi.string(),
      type: Joi.string(),
      protocol: Joi.string(),
      address: Joi.string(),
      power: Joi.string(),
      max_scan_time: Joi.string(),
      min_frequency: Joi.string(),
      max_frequency: Joi.string(),
      mode: Joi.number(),
      version: Joi.string(),
      sub_version: Joi.string(),
      organization: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteDevice = {
  query: Joi.object().keys({
    organization: Joi.string().custom(objectId),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getDevices,
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  syncDevice,
};
