const mongoose = require('mongoose');

const fingerprint = new mongoose.Schema(
  {
    baudrate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    protocol: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    power: {
      type: String,
      required: true,
    },
    max_scan_time: {
      type: String,
      required: true,
    },
    min_frequency: {
      type: String,
      required: true,
    },
    max_frequency: {
      type: String,
      required: true,
    },
    mode: {
      type: Number,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    sub_version: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

module.exports = fingerprint;
