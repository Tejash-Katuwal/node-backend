const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const municipalitySchema = mongoose.Schema(
  {
    _immutable: {
      type: Boolean,
      default: true,
      required: true,
      unique: true,
      immutable: true,
      select: false,
    },
    id: { type: String },
    name_np: {
      type: String,
      required: true,
    },
    name_en: {
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
    province_np: {
      type: String,
      required: true,
    },
    province_en: {
      type: String,
      required: true,
    },
    district_np: {
      type: String,
      required: true,
    },
    district_en: {
      type: String,
      required: true,
    },
    slogan_np: {
      type: String,
      required: true,
    },
    slogan_en: {
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
    email: {
      type: String,
      required: true,
    },
    main_logo: {
      type: String,
    },
    campaign_logo: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
municipalitySchema.plugin(toJSON);

/**
 * @typedef Nagarpalika
 */
const Nagarpalika = mongoose.model('Nagarpalika', municipalitySchema);

module.exports = Nagarpalika;
