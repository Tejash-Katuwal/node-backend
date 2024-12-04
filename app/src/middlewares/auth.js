const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const sendPermissionError = (reject, message = '') => {
  const [status, messageText] = message.split(':');
  reject(new ApiError(status || 403, messageText || "You don't have enough permission to perform this action"));
};

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights) {
    let userRights = roleRights[user.role];
    if (!userRights) {
      return sendPermissionError(reject);
    }

    const staticPermissions = userRights.static;

    if (staticPermissions && staticPermissions.includes(requiredRights)) {
      return resolve();
    }

    const dynamicPermissions = userRights.dynamic;
    if (dynamicPermissions) {
      const permissionCondition = dynamicPermissions[requiredRights];
      if (!permissionCondition) {
        return sendPermissionError(reject);
      }

      const isPermissionAvailable = await permissionCondition(req);
      if (!isPermissionAvailable) {
        return sendPermissionError(reject);
      }
      if (typeof isPermissionAvailable === 'string') {
        return sendPermissionError(reject, isPermissionAvailable);
      }

      return resolve();
    }
    return sendPermissionError(reject);
  }

  resolve();
};

const auth = (requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
