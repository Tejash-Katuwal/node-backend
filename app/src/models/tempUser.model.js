const mongoose = require('mongoose');
const User = require('./user.model');

const Temp = User.discriminator(
  'Temp',
  new mongoose.Schema({
    validity: { type: String },
  })
);

module.exports = Temp;
