const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody = {}) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User(userBody);
};

/**
 * Create multiple user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMultipleUser = async (userBody, session) => {
  const emails = userBody.map((user) => user.email);
  for (let index = 0; index < emails.length; index++) {
    const element = emails[index];
    if (await User.isEmailTaken(element)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${element} already taken`);
    }
  }
  if (session) return User.insertMany(userBody, session);

  return User.insertMany(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, organization, populate) => {
  if (populate) {
    if (organization) {
      return User.findOne({ _id: id, organization }).populate(populate);
    }
    return User.findById(id).populate(populate);
  } else if (organization) {
    return User.findOne({ _id: id, organization });
  }
  return User.findById(id);
};

const getUserIdsByRole = async (role) => {
  return User.find({ role }).select('userId -_id');
};
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ $or: [{ email: email }, { username: email }] });
};

/**
 * Update user by userid
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, organization) => {
  const user = await getUserById(userId, organization);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User भेटिएन । ');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update Student by id
 * @param {ObjectId} StudentId
 * @param {Object} updateBody
 * @returns {Promise<Student>}
 */
const updateUserByIdDiscreminator = async (updateBody = [], shouldCreateNew = false, organization) => {
  const users = [];

  for (let index = 0; index < updateBody.length; index++) {
    const element = updateBody[index];
    let user;
    if (element.id && organization) {
      user = await getUserById(element.id, organization);
    } else if (element.id) {
      user = await getUserById(element.id);
    } else if (element.userId && organization) {
      user = await User.findOne({ userId: element.userId, organization });
    } else {
      return;
    }
    if (user) {
      const newUser = {
        ...user.toObject(),
        ...element,
      };
      await User.replaceOne({ _id: user._id }, newUser, {
        overwriteDiscriminatorKey: true,
        runValidators: true,
      });

      users.push(newUser);
    } else if (shouldCreateNew) {
      const createObj = {
        role: 'unassigned',
        userType: 'Temp',
        status: 'not_verified',
        email: `${element.userId}@ibis.com.np`,
        username: `${element.userId}@ibis.com.np`,
        ...element,
      };

      const newUser = await User.create(createObj);
      users.push(newUser);
    }
  }
  return users;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByMQId = async (userId, updateBody) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    return null;
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    return null;
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, organization) => {
  let user;

  user = await getUserById(userId, organization);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User भेटिएन । ');
  }
  await user.remove();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserByMQId = async (userId) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    return null;
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserByMQId,
  deleteUserById,
  createMultipleUser,
  deleteUserByMQId,
  updateUserByIdDiscreminator,
  getUserIdsByRole,
};
