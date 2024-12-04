const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    grade_text: {
      type: String,
      required: true,
    },
    section_text: {
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
classSchema.plugin(toJSON);
classSchema.plugin(paginate);
classSchema.virtual('studentCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'grade',
  count: true,
  match: { role: 'student' },
});

/**
 * @typedef Class
 */
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
