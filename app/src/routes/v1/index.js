const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const wardRoute = require('./ward.route');
const nagarpalikaRoute = require('./nagarpalika.route');
const fileRoute = require('./fileUpload.route');
const fiscalyearRoute = require('./fiscalyear.route');
const statsRoute = require('./stats.route');
const reportRoute = require('./report.route');
const fingerPrintRoute = require('./fingerPrint.route');
const shiftRoutes = require('./shift.route');
const deviceRoute = require('./device.route');
const organizationRoute = require('./organization.route');
const studentRoute = require('./student.route');
const teacherRoute = require('./teacher.route');
const employeeRoute = require('./employee.route');
const tempUserRoute = require('./tempUser.route');
const attendanceLog = require('./attendanceLog.route');
const operationLog = require('./operationLog.route');
const organizationTypeRoute = require('./organizationType.route');
const classRoute = require('./class.route');
const mobileRoute = require('./mobile.route');
const holidayRoute = require('./holiday.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/ward',
    route: wardRoute,
  },

  {
    path: '/nagarpalika',
    route: nagarpalikaRoute,
  },
  { path: '/file', route: fileRoute },
  { path: '/fiscal-year', route: fiscalyearRoute },
  { path: '/stats', route: statsRoute },
  { path: '/report', route: reportRoute },
  { path: '/fingerPrint', route: fingerPrintRoute },
  { path: '/shifts', route: shiftRoutes },
  { path: '/devices', route: deviceRoute },
  { path: '/organizations', route: organizationRoute },
  { path: '/profile/student', route: studentRoute },
  { path: '/profile/teacher', route: teacherRoute },
  { path: '/profile/employee', route: employeeRoute },
  { path: '/attendance-log', route: attendanceLog },
  { path: '/operation-log', route: operationLog },
  { path: '/profile/temp', route: tempUserRoute },
  { path: '/organization-type', route: organizationTypeRoute },
  { path: '/class', route: classRoute },
  { path: '/mobile', route: mobileRoute },
  { path: '/holiday', route: holidayRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
