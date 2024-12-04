const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { ORGANIZATIONTYPE } = require('../config/enum');

const organizationTypeSchema = mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
    },
    name_np: {
      type: String,
      required: true,
    },
    attendeeTypes: {
      type: [String],
      enum: ORGANIZATIONTYPE.ENUM,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
organizationTypeSchema.plugin(toJSON);
organizationTypeSchema.plugin(paginate);

/**
 * @typedef OrganizationType
 */
const OrganizationType = mongoose.model('OrganizationType', organizationTypeSchema);

module.exports = OrganizationType;
