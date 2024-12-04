/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const User = require('../models/user.model');

const arg = process.argv[2];

const injectOrganization = async () => {
  if (arg) {
    await User.updateMany({ role: 'student' }, { $set: { department: arg } });

    console.log('done');
  } else {
    console.log(`command: node <file> <orgId>`);
  }
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  injectOrganization();
});
