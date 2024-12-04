const mongoose = require('mongoose');

const fingerprintData = new mongoose.Schema(
  {
    fingerNo: { type: String },
    signature: { type: mongoose.SchemaTypes.Mixed },
    image: { type: String },
  },
  { _id: false }
);

module.exports = fingerprintData;
