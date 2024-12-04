const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const studentService = require('../services/student.service');
const attendanceService = require('../services/attendanceLog.service');
const userService = require('../services/user.service');
const { deviceQueue } = require('../services/schedule.service');
const { userDeleteCommand, userCreateUpdateCommand } = require('../services/command.service');
const { calendarService } = require('../services');

const getStudents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'department', 'class', 'organization', 'type']);
  const userIdFilters = pick(req.query, ['organization']);

  const today = calendarService.getCurrentDate();
  if (filter.name) {
    if (+filter.name === +filter.name) {
      filter.roll_no = +filter.name;
    } else {
      let tmpArray = filter.name.split(' ');
      let first_name = '',
        last_name = '';
      if (tmpArray.length > 1) {
        last_name = tmpArray.pop();
        first_name = tmpArray.join(' ');
      } else {
        first_name = tmpArray[0] || '';
      }

      if (first_name) {
        filter.first_name = { $regex: first_name, $options: 'ig' };
      }
      if (last_name) {
        filter.last_name = { $regex: last_name, $options: 'ig' };
      }
    }

    delete filter.name;
  }
  if (filter.class) {
    filter.grade = filter.class;
    delete filter.class;
  }

  if (filter.type === 'present') {
    filter.userId = { $in: await attendanceService.getTodayPresentUserIds({ ...userIdFilters }) };
  } else if (filter.type === 'absent') {
    filter.userId = { $nin: await attendanceService.getTodayPresentUserIds({ ...userIdFilters }) };
  }
  delete filter.type;

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [
    { path: 'shift', select: 'title' },
    { path: 'isPresent', match: { date: { $gte: today, $lte: today } } },
  ];
  options.collation = true;
  const result = await studentService.getStudents(filter, options);
  res.send({ data: result, message: 'student lists' });
});

const createStudent = catchAsync(async (req, res) => {
  const student = await studentService.createStudent({
    ...req.body,
    createdBy: req.user.id,
  });
  const newStudent = await new Promise((resolve, reject) => {
    student.setNext('userId', (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
  await deviceQueue.add(newStudent.department, userCreateUpdateCommand(newStudent));

  res.status(httpStatus.CREATED).send({ data: student, message: 'student created' });
});

const verifyStudent = catchAsync(async (req, res) => {
  const student = await userService.updateUserByIdDiscreminator(
    [
      {
        id: req.params.id,
        ...req.body,
        userType: 'Student',
        status: 'active',
        createdBy: req.user.id,
      },
    ],
    false,
    req.query.organization
  );
  if (student.length) {
    const newUser = student.pop();
    await deviceQueue.add(newUser.department, userCreateUpdateCommand(newUser));
    res.status(httpStatus.CREATED).send({ data: newUser, message: 'student created' });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'student फेला परेन');
  }
});

const getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id, req.query.organization);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'student फेला परेन');
  }
  res.send({ data: student, message: 'student detail' });
});

const updateStudent = catchAsync(async (req, res) => {
  const student = await studentService.updateStudentById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  await deviceQueue.add(student.department, userCreateUpdateCommand(student));
  res.send({ data: student, message: 'student updated' });
});

const deleteStudent = catchAsync(async (req, res) => {
  const student = await studentService.deleteStudentById(req.params.id, req.query.organization);
  await deviceQueue.add(student.department, userDeleteCommand(student.userId));

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  verifyStudent,
};
