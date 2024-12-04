/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const scheduleService = require('../services/schedule.service');
const { clearAllData } = require('../services/command.service');

const arg = process.argv[2];

const clearDevice = async () => {
  if (arg) {
    await scheduleService.initDeviceSchedule();
    await scheduleService.deviceQueue.addBySN(arg, clearAllData());
    console.log('done');
  } else {
    console.log(`command: node <file> <serial_number>`);
  }
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  clearDevice();
});
