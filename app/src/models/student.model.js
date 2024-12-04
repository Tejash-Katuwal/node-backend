const mongoose = require('mongoose');
const User = require('./user.model');

const Student = User.discriminator(
  'Student',
  new mongoose.Schema({
    validity: { type: String, required: true },
    grade: { type: mongoose.SchemaTypes.ObjectId, ref: 'Class' },
    roll_no: { type: String },
    // section: { type: String },
    date_of_birth_ad: { type: String },
    date_of_birth_bs: { type: String },
    address: { type: String },
    father_name: { type: String },
    mother_name: { type: String },
    guardian_name: { type: String },
    guardian_phone: { type: String },
    guardian_email: { type: String },
  })
);

module.exports = Student;
