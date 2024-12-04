const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const attendanceSchema = mongoose.Schema(
  {
    SN: { type: String, required: true },
    userId: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
    },
    verify: {
      type: String,
    },
    workcode: {
      type: String,
    },
    IDNum: {
      type: String,
    },
    type: {
      type: String,
    },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);
attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ userId: 1, time: -1 });
attendanceSchema.index({ userId: 1 });
attendanceSchema.index({ organization: 1 });

attendanceSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

/**
 * @typedef AttendanceLog
 */
const AttendanceLog = mongoose.model('AttendanceLog', attendanceSchema);

module.exports = AttendanceLog;
