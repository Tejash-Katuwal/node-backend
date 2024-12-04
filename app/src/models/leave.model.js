const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const leaveSchema = mongoose.Schema(
  {
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    dates: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
    application: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
leaveSchema.plugin(toJSON);
leaveSchema.plugin(paginate);

/**
 * @typedef Leave
 */
const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
