/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const User = require('../models/user.model');
const Student = require('../models/student.model');
const Temp = require('../models/tempUser.model');
const scheduleService = require('../services/schedule.service');
const { userCreateUpdateCommand } = require('../services/command.service');

// IMPORT DATA INTO DB
const importData = async (arg) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'unassigned', 'admin'] } });
    // await User.updateMany({ role: { $in: ['student', 'unassigned'] } }, { $inc: { userId: 200 } });
    await scheduleService.initDeviceSchedule();
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      scheduleService.deviceQueue.addBySN(arg, userCreateUpdateCommand(element));
    }
    console.log('done');
  } catch (e) {
    console.log(e);
  }
};

const arg = process.argv[2];

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  if (arg) {
    importData(arg);
  } else {
    console.log(`command: node <file> <serial_number>`);
  }
});
