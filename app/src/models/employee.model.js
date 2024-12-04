const mongoose = require('mongoose');
const User = require('./user.model');

const Employee = User.discriminator(
  'Employee',
  new mongoose.Schema({
    validity: { type: String, required: true },
  })
);

module.exports = Employee;
