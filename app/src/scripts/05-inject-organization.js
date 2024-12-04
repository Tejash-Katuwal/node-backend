/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const AttendanceLog = require('../models/attendanceLog.model');
const User = require('../models/user.model');
const Device = require('../models/device.model');
const ClassModel = require('../models/class.model');
const shiftModel = require('../models/shift.model');

const arg = process.argv[2];

const injectOrganization = async () => {
  if (arg) {
    await AttendanceLog.updateMany({}, { $set: { organization: arg } });
    await User.updateMany({}, { $set: { organization: arg } });
    await Device.updateMany({}, { $set: { organization: arg } });
    await ClassModel.updateMany({}, { $set: { organization: arg } });
    await shiftModel.updateMany({}, { $set: { organization: arg } });
    console.log('done');
  } else {
    console.log(`command: node <file> <orgId>`);
  }
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  injectOrganization();
});
