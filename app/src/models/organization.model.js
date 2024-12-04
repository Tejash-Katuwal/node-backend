const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { ORGANIZATIONTYPE } = require('../config/enum');

const organizationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    device: {
      type: [String],
      ref: 'Device',
      default: [],
    },
    type: {
      type: String,
      enum: ['organization', 'department'],
      default: 'organization',
    },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    organizationType: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'OrganizationType',
    },
    attendeeTypes: {
      type: [String],
      enum: ORGANIZATIONTYPE.ENUM,
      required: true,
    },
    image: { type: String },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

/**
 * @typedef Organization
 */
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
