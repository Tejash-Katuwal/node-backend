const mongoose = require('mongoose');
const { FINGERPRINT } = require('../../config/enum');

const fingerprint = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: FINGERPRINT.ENUM, default: FINGERPRINT.DEFAULT },
    left: { type: String },
    right: { type: String },
  },
  { _id: false }
);

module.exports = fingerprint;
