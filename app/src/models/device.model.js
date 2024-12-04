const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const deviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serial_number: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['rfid', 'zkteco'],
    },
    config: {
      type: mongoose.SchemaTypes.Mixed,
    },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
deviceSchema.plugin(toJSON);
deviceSchema.plugin(paginate);

/**
 * @typedef Device
 */
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
