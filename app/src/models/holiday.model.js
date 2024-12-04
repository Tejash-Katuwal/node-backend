const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const holidaySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    dates: {
      type: [String],
      default: [],
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
holidaySchema.plugin(toJSON);
holidaySchema.plugin(paginate);

/**
 * @typedef Holiday
 */
const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
