const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const attendanceLogService = require('../services/attendanceLog.service');
const studentService = require('../services/student.service');
const userService = require('../services/user.service');

const getAttendanceLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'grade', 'role', 'organization', 'from', 'to']);
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  if (filter.grade) {
    let userIds = await studentService.getStudentsUserIdsByGrade(filter.grade);
    userIds = userIds.map((userId) => userId.userId);
    filter.userId = { $in: userIds };
    delete filter.grade;
    delete filter.role;
  } else if (filter.role) {
    let userIds = await userService.getUserIdsByRole(filter.role);
    userIds = userIds.map((userId) => userId.userId);
    filter.userId = { $in: userIds };
    delete filter.role;
  }

  if (filter.from && filter.to) {
    filter.date = { $gte: filter.from, $lte: filter.to };
  } else if (filter.from) {
    filter.date = { $gte: filter.from };
  } else if (filter.to) {
    filter.date = { $lte: filter.to };
  }
  delete filter.from;
  delete filter.to;

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [
    {
      path: 'userInfo',
      options: {
        select: {
          userId: 1,
          first_name: 1,
          last_name: 1,
          card_number: 1,
          role: 1,
          email: 1,
          image: 1,
          address: 1,
          phone: 1,
          date_of_birth_bs: 1,
          roll_no: 1,
          grade: 1,
          date_of_birth_ad: 1,
        },
      },
      populate: [
        { path: 'department', select: 'name' },
        { path: 'shift', select: 'title' },
        { path: 'grade', select: 'name' },
      ],
    },
  ];
  const result = await attendanceLogService.getAttendanceLogs(filter, options);
  res.send({ data: result, message: 'attendanceLog lists' });
});

const createAttendanceLog = catchAsync(async (req, res) => {
  const attendanceLog = await attendanceLogService.createAttendanceLog({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(httpStatus.CREATED).send({ data: attendanceLog, message: 'attendanceLog created' });
});

const getAttendanceLog = catchAsync(async (req, res) => {
  const attendanceLog = await attendanceLogService.getAttendanceLogById(req.params.id, req.query.organization);
  if (!attendanceLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'attendanceLog फेला परेन');
  }
  res.send({ data: attendanceLog, message: 'attendanceLog detail' });
});

const updateAttendanceLog = catchAsync(async (req, res) => {
  const attendanceLog = await attendanceLogService.updateAttendanceLogById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  res.send({ data: attendanceLog, message: 'attendanceLog updated' });
});

const deleteAttendanceLog = catchAsync(async (req, res) => {
  await attendanceLogService.deleteAttendanceLogById(req.params.id, req.query.organization);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAttendanceLogs,
  createAttendanceLog,
  getAttendanceLog,
  updateAttendanceLog,
  deleteAttendanceLog,
};
