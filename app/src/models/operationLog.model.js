const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const operationLogSchema = mongoose.Schema(
  {
    SN: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    time: {
      type: String,
    },
    value1: {
      type: String,
    },
    value2: {
      type: String,
    },
    value3: {
      type: String,
    },
    reserved: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
operationLogSchema.plugin(toJSON);
operationLogSchema.plugin(paginate);

/**
 * @typedef OperationLog
 */
const OperationLog = mongoose.model('OperationLog', operationLogSchema);

module.exports = OperationLog;
