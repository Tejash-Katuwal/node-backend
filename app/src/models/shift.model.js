const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shiftSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
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
shiftSchema.plugin(toJSON);
shiftSchema.plugin(paginate);

/**
 * @typedef Shift
 */
const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
