const mongoose = require('mongoose');
const User = require('./user.model');

const Teacher = User.discriminator(
  'Teacher',
  new mongoose.Schema({
    validity: { type: String, required: true },
    isClassTeacher: { type: Boolean, default: false },
    grade: { type: mongoose.SchemaTypes.ObjectId, ref: 'Class' },
  })
);

module.exports = Teacher;
