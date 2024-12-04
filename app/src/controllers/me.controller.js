const catchAsync = require('../utils/catchAsync');
const studentService = require('../services/student.service');
const teacherService = require('../services/teacher.service');
const employeeService = require('../services/employee.service');
const userService = require('../services/user.service');
const { getCurrentDate } = require('../services/calendar.service');

const getMe = catchAsync(async (req, res) => {
  const today = getCurrentDate();
  if (req.user.role === 'student') {
    const student = await studentService.getStudentById(req.user.id, null, [
      { path: 'grade', select: 'name' },
      { path: 'organization' },
      { path: 'isPresent', match: { date: { $gte: today, $lte: today } } },
    ]);
    res.send({ data: student, message: 'current user profile' });
  } else if (req.user.role === 'teacher') {
    const teacher = await teacherService.getTeacherById(req.user.id, null, [
      { path: 'organization' },
      { path: 'grade', select: 'name' },
      { path: 'isPresent', match: { date: { $gte: today, $lte: today } } },
    ]);
    res.send({ data: teacher, message: 'current user profile' });
  } else if (req.user.role === 'employee') {
    const employee = await employeeService.getEmployeeById(req.user.id, null, [
      { path: 'grade', select: 'name' },
      { path: 'organization' },
      { path: 'isPresent', match: { date: { $gte: today, $lte: today } } },
    ]);
    res.send({ data: employee, message: 'current user profile' });
  } else if (req.user.role === 'organizationAdmin') {
    const user = await userService.getUserById(req.user.id, null, [{ path: 'organization' }]);
    res.send({ data: user, message: 'current user profile' });
  } else res.send({ data: req.user, message: 'current user profile' });
});

const updateMe = catchAsync(async (req, res) => {
  const user = userService.updateUserById(req.user.id, req.body);
  res.send({ data: user, message: 'current user profile' });
});

module.exports = {
  getMe,
  updateMe,
};
