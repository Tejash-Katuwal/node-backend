const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const teacherService = require('../services/teacher.service');
const userService = require('../services/user.service');
const { deviceQueue } = require('../services/schedule.service');
const { userCreateUpdateCommand, userDeleteCommand } = require('../services/command.service');

const getTeachers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'department', 'organization']);

  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'shift', select: 'title' }];

  const result = await teacherService.getTeachers(filter, options);
  res.send({ data: result, message: 'teacher lists' });
});

const createTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.createTeacher({
    ...req.body,
    createdBy: req.user.id,
  });
  const newTeacher = await new Promise((resolve, reject) => {
    teacher.setNext('userId', (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
  await deviceQueue.add(newTeacher.department, userCreateUpdateCommand(newTeacher));
  res.status(httpStatus.CREATED).send({ data: teacher, message: 'teacher created' });
});

const verifyTeacher = catchAsync(async (req, res) => {
  const teacher = await userService.updateUserByIdDiscreminator(
    [
      {
        id: req.params.id,
        ...req.body,
        userType: 'Teacher',
        status: 'active',
        createdBy: req.user.id,
      },
    ],
    false,
    req.query.organization
  );
  if (teacher.length) {
    const newTeacher = teacher.pop();
    await deviceQueue.add(teacher.department, userCreateUpdateCommand(newTeacher));
    res.status(httpStatus.CREATED).send({ data: newTeacher, message: 'teacher created' });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'teacher फेला परेन');
  }
});

const getTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id, req.query.organization);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'teacher फेला परेन');
  }
  res.send({ data: teacher, message: 'teacher detail' });
});

const updateTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.updateTeacherById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  await deviceQueue.add(teacher.department, userCreateUpdateCommand(teacher));

  res.send({ data: teacher, message: 'teacher updated' });
});

const deleteTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.deleteTeacherById(req.params.id, req.query.organization);
  await deviceQueue.add(teacher.department, userDeleteCommand(teacher.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getTeachers,
  createTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  verifyTeacher,
};
