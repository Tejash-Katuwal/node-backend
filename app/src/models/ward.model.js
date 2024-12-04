const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wardSchema = mongoose.Schema(
  {
    nagarpalika: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Nagarpalika',
      // required: true,
    },
    ward_np: {
      type: String,
      required: true,
    },
    ward_en: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_np: {
      type: String,
      required: true,
    },
    phone_en: {
      type: String,
      required: true,
    },
    address_np: {
      type: String,
      required: true,
    },
    address_en: {
      type: String,
      required: true,
    },
    main_logo: {
      type: String,
    },
    campaign_logo: {
      type: String,
    },
    fiscal: { type: String },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wardSchema.plugin(toJSON);
wardSchema.plugin(paginate);

wardSchema.pre('save', async function (next) {
  if (this._id) {
    this._id = this._id.toString();
  } else this._id = mongoose.Types.ObjectId().toString();
  next();
});

/**
 * @typedef Ward
 */
const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
