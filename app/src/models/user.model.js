const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    first_name: { type: String },
    last_name: { type: String },
    image: { type: String },
    phone: { type: String },
    ward: {
      type: String,
    },
    fiscal: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'not_verified', 'deleted_from_device'],
      default: 'active',
    },
    userId: {
      type: Number,
    },
    authMethod: {
      private: true,
      type: String,
      enum: ['bycrypt', 'pbkdf2_sha256'],
      default: 'bycrypt',
    },
    Passwd: { type: String },
    privilege: { type: String, enum: ['user', 'super_user', '0', '14'], default: 'user' },
    card_number: { type: String },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    department: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    shift: { type: mongoose.SchemaTypes.ObjectId, ref: 'Shift' },
  },
  {
    timestamps: true,
    discriminatorKey: 'userType',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(AutoIncrement, {
  id: 'userId',
  inc_field: 'userId',
  reference_fields: ['organization'],
  disable_hooks: true,
  start_seq: 3001,
});

userSchema.virtual('isPresent', {
  ref: 'AttendanceLog',
  localField: 'userId',
  foreignField: 'userId',
  count: true,
});

userSchema.index({ userId: 1, organization: 1 }, { unique: true });
userSchema.index({ grade: 1 });

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const encode = (password, { algorithm, salt, iterations }) => {
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  return `${algorithm}$${iterations}$${salt}$${hash.toString('base64')}`;
};

const decode = (encoded) => {
  const [algorithm, iterations, salt, hash] = encoded.split('$');
  return {
    algorithm,
    hash,
    iterations: parseInt(iterations, 10),
    salt,
  };
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatchPython = async function (password) {
  const user = this;
  const decoded = decode(user.password);
  const encodedPassword = encode(password, decoded);
  return user.password === encodedPassword;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user._id) {
    user._id = user._id.toString();
  } else user._id = mongoose.Types.ObjectId().toString();
  if (user.password && user.authMethod !== 'pbkdf2_sha256')
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  next();
});

userSchema.pre('insertMany', async function (next, docs) {
  if (Array.isArray(docs) && docs.length) {
    const hashedUsers = docs.map(async (user) => {
      return await new Promise(async (resolve, reject) => {
        if (user._id) {
          user._id = this._id.toString();
        } else user._id = mongoose.Types.ObjectId().toString();
        if (user.authMethod !== 'pbkdf2_sha256') {
          bcrypt
            .hash(user.password, 8)
            .then((hash) => {
              user.password = hash;
              resolve(user);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          resolve(user);
        }
      });
    });
    docs = await Promise.all(hashedUsers);
    next();
  } else {
    return next(new Error('User list should not be empty')); // lookup early return pattern
  }
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
