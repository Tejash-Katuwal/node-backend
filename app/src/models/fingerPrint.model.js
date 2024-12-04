const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');
const fingerprintData = require('./subDocuments/fingerPrintData');

const signatureSchema = mongoose.Schema(
  {
    applicant: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'DisabledProfile',
    },
    type: { type: String, enum: ['disabled', 'elderly'], default: 'disabled' },
    fingerPrint: { type: [fingerprintData] },
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
signatureSchema.plugin(toJSON);
signatureSchema.plugin(paginate);

/**
 * @typedef FingerPrint
 */
const FingerPrint = mongoose.model('FingerPrint', signatureSchema);

module.exports = FingerPrint;
