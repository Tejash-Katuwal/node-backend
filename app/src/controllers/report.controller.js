const catchAsync = require('../utils/catchAsync');

const reportService = require('../services/report.service');
const organizationService = require('../services/organization.service');
const { ADToBS } = require('../services/bsdate.service');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { MONTHS } = require('../config/enum');

const getAttendanceReport = catchAsync(async (req, res) => {
  const {
    data,
    holidays: { days: holidays = {} },
  } = await reportService.getAttendanceReport(req.query);
  res.send({ data: { results: data, holidays } });
});

const getAbsenseReport = catchAsync(async (req, res) => {
  const {
    data,
    holidays: { days: holidays = {} },
  } = await reportService.getAttendanceReport(req.query, '$date');
  const absenseData = data
    .map(({ days, ...rest }) => ({ ...rest, ...reportService.getAbsenseData({ days, holidays }, req.query) }))
    .filter((user) => user.absentDays?.length > 0);
  res.send({ data: { results: absenseData } });
});

const getAbsenseReportExcel = catchAsync(async (req, res) => {
  const {
    data,
    holidays: { days: holidays = {} },
  } = await reportService.getAttendanceReport(req.query, '$date');
  let organization = {};
  if (req.query.organization) {
    organization = (await organizationService.getOrganizationById(req.query.organization)) || {};
  }
  const url = await reportService.generateAbsenseReport(
    { data: data, organization, holidays },
    { from: req.query.from, to: req.query.to }
  );
  res.send({ data: { url: `https://${req.hostname}/api/uploads/${url}` } });
});

const getAttendanceReportExcel = catchAsync(async (req, res) => {
  const {
    data,
    holidays: { days: holidays = {} },
  } = await reportService.getAttendanceReport(req.query);
  let organization = {};
  if (req.query.organization) {
    organization = (await organizationService.getOrganizationById(req.query.organization)) || {};
  }
  const url = await reportService.generateAttendanceReport(
    { data: data, organization, holidays },
    { year: req.query.year, month: req.query.month, monthName: MONTHS[req.query.month] }
  );
  res.send({ data: { url: `https://${req.hostname}/api/uploads/${url}` } });
});

const getAttendanceReportIndividual = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['from', 'to', 'limit', 'page', 'organization', 'stats', 'grade']);
  if (!filter.from || !filter.to) {
    if (filter.limit && filter.page) {
      filter.to = ADToBS(
        moment()
          .add(-1 * (filter.page - 1) * filter.limit, 'days')
          .format('YYYY-MM-DD')
      );
      filter.from = ADToBS(
        moment()
          .add(-1 * ((filter.page - 1) * filter.limit) - filter.limit + 1, 'days')
          .format('YYYY-MM-DD')
      );
    }
  }

  const data = await reportService.getAttendanceReportIndividual(req.params.id || req.query.id, filter);
  const newData = data.pop();
  if (!newData) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'report भेटिएन । ');
  }
  if (filter.stats) {
    if (req.user.grade) {
      newData.stats = await reportService.getClassTeacherStats(req.user.grade);
    }
  }
  const { daysData, total } = reportService.getAttendanceIndividualData(newData, {
    from: filter.from,
    to: filter.to,
  });
  newData.days = daysData;
  newData.total = total;
  res.send({ data: req.query.id ? newData : { results: newData } });
});

const getAttendanceReportIndividualExcel = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['from', 'to', 'limit', 'page', 'organization']);
  if (!filter.from || !filter.to) {
    if (filter.limit && filter.page) {
      filter.to = ADToBS(
        moment()
          .add(-1 * (filter.page - 1) * filter.limit, 'days')
          .format('YYYY-MM-DD')
      );
      filter.from = ADToBS(
        moment()
          .add(-1 * ((filter.page - 1) * filter.limit) - filter.limit, 'days')
          .format('YYYY-MM-DD')
      );
    }
  }
  const data = await reportService.getAttendanceReportIndividual(req.params.id, filter);
  const newData = data.pop();
  const url = await reportService.generateAttendanceIndividualReport(
    { data: newData },
    { from: filter.from, to: filter.to }
  );

  res.send({ data: { url: `https://${req.hostname}/api/uploads/${url}` } });
});

module.exports = {
  getAttendanceReport,
  getAttendanceReportExcel,
  getAttendanceReportIndividual,
  getAttendanceReportIndividualExcel,
  getAbsenseReport,
  getAbsenseReportExcel,
};
