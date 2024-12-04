const express = require('express');

const router = express.Router();

const reportController = require('../../controllers/report.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');

router
  .route('/attendance')
  .get(auth('getAttendanceReport'), validate(reportValidation.getAttendanceReport), reportController.getAttendanceReport);

router
  .route('/attendance/excel')
  .get(
    auth('getAttendanceReportExcel'),
    validate(reportValidation.getAttendanceReport),
    reportController.getAttendanceReportExcel
  );

router
  .route('/absence')
  .get(auth('getAbsenceReport'), validate(reportValidation.getAbsenceReport), reportController.getAbsenseReport);
router
  .route('/absence/excel')
  .get(auth('getAbsenceReportExcel'), validate(reportValidation.getAbsenceReport), reportController.getAbsenseReportExcel);

router
  .route('/attendance/me')
  .get(
    auth('getAttendanceReportIndividualStudent'),
    validate(reportValidation.getAttendanceMe),
    reportController.getAttendanceReportIndividual
  );

router
  .route('/attendance/:id/individual')
  .get(
    auth('getAttendanceReportIndividual'),
    validate(reportValidation.getAttendanceReportIndividual),
    reportController.getAttendanceReportIndividual
  );

router
  .route('/attendance/:id/individual/excel')
  .get(
    auth('getAttendanceReportIndividualExcel'),
    validate(reportValidation.getAttendanceReportIndividual),
    reportController.getAttendanceReportIndividualExcel
  );

module.exports = router;
