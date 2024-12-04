/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const Class = require('../models/class.model');

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Class.create([
      {
        name: 'Eight "A"',
        grade_text: '8',
        section_text: 'A',
      },
      {
        name: 'Eight "B"',
        grade_text: '8',
        section_text: 'B',
      },
      {
        name: 'Seven "A"',
        grade_text: '7',
        section_text: 'A',
      },
      {
        name: 'Seven "B"',
        grade_text: '7',
        section_text: 'B',
      },
      {
        name: 'Six "A"',
        grade_text: '6',
        section_text: 'A',
      },
      {
        name: 'Six "B"',
        grade_text: '6',
        section_text: 'B',
      },
      { name: 'Five "A"', grade_text: '5', section_text: 'A' },
      { name: 'Five "B"', grade_text: '5', section_text: 'B' },
      { name: 'Four "A"', grade_text: '4', section_text: 'A' },
      { name: 'Four "B"', grade_text: '4', section_text: 'B' },
      { name: 'Three', grade_text: '3', section_text: 'A' },
      { name: 'Two', grade_text: '2', section_text: 'A' },
      { name: 'One', grade_text: '1', section_text: 'A' },
      { name: 'UKG', grade_text: 'UKG', section_text: 'A' },
      { name: 'LKG', grade_text: 'LKG', section_text: 'A' },
      { name: 'Nursery', grade_text: 'Nursery', section_text: 'A' },
    ]);
    console.log('done');
  } catch (e) {
    console.log(e);
  }
};
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  importData();
});
