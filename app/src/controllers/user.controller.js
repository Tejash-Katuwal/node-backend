const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const studentService = require('../services/student.service');
const { deviceQueue } = require('../services/schedule.service');
const { userCreateUpdateCommand, userDeleteCommand } = require('../services/command.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const newUser = await new Promise((resolve, reject) => {
    user.setNext('userId', (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
  await deviceQueue.add(user.organization || 'all', userCreateUpdateCommand(newUser));
  res.status(httpStatus.CREATED).send({ data: user, message: 'User created' });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'organization', 'department', 'grade']);
  if (filter.role) {
    const roles = filter.role.split(',');
    filter.role = { $in: roles };
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [
    { path: 'department', select: 'name' },
    { path: 'shift', select: 'title' },
    { path: 'organization', select: 'name' },
  ];

  if (filter.grade) {
    const result = await studentService.getStudents(filter, options);
    res.send({ data: result, messaage: 'user lists' });
  } else {
    const result = await userService.queryUsers(filter, options);
    res.send({ data: result, messaage: 'user lists' });
  }
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req.query.organization);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User भेटिएन । ');
  }

  res.send({ data: user, message: 'user details' });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body, req.query.organization);
  await deviceQueue.add(user.organization || 'all', userCreateUpdateCommand(user));
  res.send({ data: user, message: 'user updated' });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.userId, req.query.organization);
  await deviceQueue.add(user.organization || 'all', userDeleteCommand(user.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
