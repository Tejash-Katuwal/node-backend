const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { DEVICEPLATFORM } = require('../config/enum');

const { Schema } = mongoose;
const mobileSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mobileId: {
      type: String,
      required: true,
    },
    pushTokenId: {
      type: String,
      trim: true,
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: DEVICEPLATFORM.ENUM,
      default: DEVICEPLATFORM.DEFAULT,
    },
  },
  { timestamps: true }
);
mobileSchema.plugin(toJSON);
mobileSchema.plugin(paginate);

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;
