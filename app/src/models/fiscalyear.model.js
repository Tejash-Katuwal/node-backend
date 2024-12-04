const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const fiscalYearSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
fiscalYearSchema.plugin(toJSON);
fiscalYearSchema.plugin(paginate);
fiscalYearSchema.index({ is_active: 1 }, { unique: true, partialFilterExpression: { is_active: true } });

fiscalYearSchema.statics.deactivateOther = async function (_id) {
  await this.updateMany({ _id: { $ne: _id }, is_active: true }, { is_active: false });
};

fiscalYearSchema.pre('save', async function (next) {
  const fiscalyear = this;
  if (fiscalyear._id) {
    fiscalyear._id = fiscalyear._id.toString();
  } else fiscalyear._id = mongoose.Types.ObjectId().toString();

  if (fiscalyear.isModified('is_active') && fiscalyear.is_active) {
    await this.constructor.deactivateOther(this._id);
  }
  next();
});

/**
 * @typedef FiscalYear
 */
const FiscalYear = mongoose.model('FiscalYear', fiscalYearSchema);

module.exports = FiscalYear;
