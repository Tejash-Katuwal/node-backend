const stringifyFilter = require('../utils/stringifyFilter');
const { getNepaliNumber } = require('./calendar.service');
const excelService = require('./excel.service');
const calendarService = require('./calendar.service');
const pick = require('../utils/pick');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const mongoose = require('mongoose');
const attendanceService = require('../services/attendanceLog.service');
const Holiday = require('../models/holiday.model');

const getAttendanceIndividualData = ({ days = {}, holidays = {} } = {}, { from, to }) => {
  const dateRange = calendarService.getDatesBetween(from, to);
  const today = calendarService.getCurrentDate();
  const daysData = dateRange
    .map((date) => {
      let isPresent = 'P';
      if (date > today) isPresent = '-';
      else if (holidays[date]) isPresent = 'H';
      else isPresent = days[date] ? 'P' : 'A';
      return {
        date,
        status: isPresent,
        checkin: days[date]?.[0] || '',
        checkout: days[date]?.[1] || '',
      };
    })
    .reverse();
  return {
    daysData,
    total: {
      date: 'कुल उपस्थित',
      status: Object.keys(days).length || getNepaliNumber(0),
      checkin: '',
      checkout: '',
    },
  };
};
const generateAttendanceIndividualReport = async (reportData = {}, filters = {}) => {
  const columns = [
    { header: 'मिति', key: 'date', width: 10 },
    { header: 'स्थिति', key: 'status', width: 10 },
    { header: 'चेक इन', key: `checkin`, width: 10 },
    { header: 'चेक आउट', key: `checkout`, width: 10 },
  ];

  const subColumns = [];
  const merge = [];
  const data = reportData.data || {};
  const { daysData: rows, total } = getAttendanceIndividualData(data, {
    from: filters.from,
    to: filters.to,
  });
  rows.push(total);
  const fileName = `individual-attendance-report.xlsx`;
  const location = `${__dirname}/../../uploads/${fileName}`;

  await excelService.generateExcel({
    sheets: [
      {
        columns,
        rows,
        subColumns,
        merge,
        filterHeading: stringifyFilter({
          'Start Date': getNepaliNumber(filters.from),
          'End Date': getNepaliNumber(filters.to),
          'First Name': data.first_name,
          'Last Name': data.last_name,
        }),
        headerTo: 'D',
        headerTitle: `${data?.organization?.name || ''}\n${data?.organization?.address || ''}\n व्यक्तिगत रिपोर्ट `,
      },
    ],
    location,
  });
  return fileName;
};

const getAttendanceData = ({ days = {}, holidays = {} } = {}, noOfDays, futureFromDate) => {
  const daysData = {};
  Array.from({ length: noOfDays }, (_, i) => {
    if (i + 1 < futureFromDate) {
      const isPresent = days[`${('0' + (i + 1)).slice(-2)}`];
      if (holidays[`${('0' + (i + 1)).slice(-2)}`]) {
        daysData[i + 1] = 'H';
      } else if (isPresent) {
        daysData[i + 1] = 'P';
      } else {
        daysData[i + 1] = 'A';
      }
    } else daysData[i + 1] = '-';
  });

  daysData.total = getNepaliNumber(Object.keys(days || {}).length);
  return daysData;
};
const generateAttendanceReport = async (reportData = {}, filters = {}) => {
  let noOfDays = 32;
  const today = calendarService.getCurrentDate();
  const [cY, cM, cD] = today.split('-');
  let futureFromDate = 33;
  const { year, monthName: month } = filters;

  if (filters.year && filters.month) {
    const { year, month } = filters;
    noOfDays = calendarService.noOfDaysMonth(+month, +year);
    if (+year > +cY) futureFromDate = 1;
    if (+year === +cY && +month > +cM) futureFromDate = 1;
    if (+year === +cY && +month === +cM) futureFromDate = +cD + 1;
  }

  const columns = [
    { header: 'क्र सं', key: 'sn', width: 5 },
    { header: 'कक्षा', key: 'class', width: 10 },
    { header: 'रोल न.', key: 'roll_no', width: 10 },
    { header: 'नाम', key: `fullName`, width: 24 },
    ...Array.from({ length: noOfDays }, (_, i) => {
      return { header: getNepaliNumber(i + 1), key: i + 1, width: 6 };
    }),
    { header: 'कुल उपस्थित', key: 'total', width: 10 },
  ];

  const subColumns = [];
  const merge = [];

  const rows = (reportData.data || []).map((data, index) => {
    return {
      sn: index + 1,
      ...data,
      class: data.gradeData?.name || '',
      fullName: `${data.first_name || ''} ${data.last_name || ''}`,
      ...getAttendanceData({ days: data?.days, holidays: reportData?.holidays }, noOfDays, futureFromDate),
    };
  });

  const fileName = `attendance-report.xlsx`;
  const location = `${__dirname}/../../uploads/${fileName}`;

  await excelService.generateExcel({
    sheets: [
      {
        columns,
        rows,
        subColumns,
        merge,
        filterHeading: stringifyFilter({ year, month }),
        headerTo: 'AI',
        headerTitle: `${reportData?.organization?.name || ''}\n${
          reportData?.organization?.address || ''
        }\n मासिक हाजिरी शीट`,
      },
    ],
    location,
  });
  return fileName;
};

const getAbsenseData = ({ days = {}, holidays = {} } = {}, { from, to }) => {
  const today = calendarService.getCurrentDate();
  const dateRange = calendarService.getDatesBetween(from || today, to || today);

  const absentDates = [];

  dateRange.forEach((date) => {
    if (!(date > today) && !days[date] && !holidays[date]) absentDates.push(date);
  });

  return { absentDays: absentDates.join(' , '), total: absentDates.length };
};

const generateAbsenseReport = async (reportData = {}, filters = {}) => {
  const columns = [
    { header: 'क्र सं', key: 'sn', width: 5 },
    { header: 'कक्षा', key: 'class', width: 10 },
    { header: 'रोल न.', key: 'roll_no', width: 10 },
    { header: 'नाम', key: `fullName`, width: 24 },
    { header: 'अनुपस्थित मिति ', key: `absentDays`, width: 44 },
    { header: 'कुल अनुपस्थित', key: 'total', width: 10 },
  ];

  const subColumns = [];
  const merge = [];

  const rows = (reportData.data || [])
    .map((data, index) => {
      return {
        sn: index + 1,
        ...data,
        class: data.gradeData?.name || '',
        fullName: `${data.first_name || ''} ${data.last_name || ''}`,
        ...getAbsenseData({ days: data?.days, holidays: reportData?.holidays }, filters),
      };
    })
    .filter((user) => user.absentDays?.length > 0);

  const fileName = `absence-report.xlsx`;
  const location = `${__dirname}/../../uploads/${fileName}`;

  await excelService.generateExcel({
    sheets: [
      {
        columns,
        rows,
        subColumns,
        merge,
        filterHeading: stringifyFilter(filters),
        headerTo: 'F',
        headerTitle: `${reportData?.organization?.name || ''}\n${
          reportData?.organization?.address || ''
        }\n मासिक अनुपस्थिति शीट`,
      },
    ],
    location,
  });
  return fileName;
};

const getAttendanceReport = async (query = {}, grpBy = '$day') => {
  let groupBy = grpBy;
  const filter = pick(query, ['department', 'grade', 'role', 'month', 'year', 'organization']);
  const match = { status: 'active' };
  const pipelineDate = [];
  const holidayFilter = {};

  if (filter.month && filter.year) {
    holidayFilter.dates = {
      $gte: `${filter.year}-${('0' + filter.month).slice(-2)}-01`,
      $lte: `${filter.year}-${('0' + filter.month).slice(-2)}-33`,
    };
    pipelineDate.push({ $gte: ['$date', `${filter.year}-${('0' + filter.month).slice(-2)}-01`] });
    pipelineDate.push({ $lte: ['$date', `${filter.year}-${('0' + filter.month).slice(-2)}-33`] });
  } else if (filter.from || filter.to) {
    groupBy = '$date';
    if (filter.from) {
      holidayFilter.dates = {};
      holidayFilter.dates.$gte = `${filter.year}-${('0' + filter.month).slice(-2)}-01`;
      pipelineDate.push({ $gte: ['$date', filter.from] });
    }
    if (filter.to) {
      if (!holidayFilter.dates) holidayFilter.dates = {};
      holidayFilter.dates.$lte = `${filter.year}-${('0' + filter.month).slice(-2)}-33`;
      pipelineDate.push({ $lte: ['$date', filter.to] });
    }
  }

  if (filter.grade) {
    match.grade = mongoose.Types.ObjectId(filter.grade);
  }

  if (filter.role) {
    match.role = filter.role;
  } else {
    match.role = { $in: ['student', 'employee', 'teacher'] };
  }

  if (filter.department) {
    match.department = mongoose.Types.ObjectId(filter.department);
  }

  if (filter.organization) {
    holidayFilter.organization = mongoose.Types.ObjectId(filter.organization);
    match.organization = mongoose.Types.ObjectId(filter.organization);
  }

  const [data, holidays] = await Promise.all([
    await User.aggregate([
      {
        $match: match,
      },
      { $sort: { userId: 1 } },
      {
        $lookup: {
          from: 'classes',
          as: 'gradeData',
          let: { classId: '$grade' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$classId', '$_id'] }],
                },
              },
            },
            { $project: { name: 1 } },
          ],
        },
      },
      { $unwind: { path: '$gradeData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'attendancelogs',
          as: 'attendanceLogs',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$userId', '$userId'] }, ...pipelineDate],
                },
              },
            },
            { $sort: { time: -1 } },
            { $project: { time: 1, day: { $substr: ['$date', 8, 10] }, date: 1 } },
            { $group: { _id: groupBy, k: { $first: groupBy }, v: { $first: true } } },
            { $project: { _id: 0, k: 1, v: 1 } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          first_name: 1,
          last_name: 1,
          phone: 1,
          grade: 1,
          gradeData: 1,
          roll_no: 1,
          id: '$_id',
          userId: 1,
          role: 1,
          days: { $arrayToObject: '$attendanceLogs' },
        },
      },
    ]).allowDiskUse(true),
    await Holiday.aggregate([
      {
        $match: holidayFilter,
      },
      {
        $unwind: '$dates',
      },
      {
        $project: {
          _id: 0,
          name: 1,
          organization: 1,
          dates: 1,
          day: {
            $substr: ['$dates', 8, 10],
          },
          date: '$dates',
        },
      },
      {
        $match: holidayFilter,
      },
      {
        $group: {
          _id: 'dates',
          dates: {
            $addToSet: {
              k: groupBy,
              v: '$name',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          days: {
            $ifNull: [{ $arrayToObject: '$dates' }, {}],
          },
        },
      },
    ]),
  ]);
  return { data, holidays: holidays.pop() || {} };
};

const getAttendanceReportIndividual = async (id, query = {}) => {
  const { from, to, organization, grade } = query;

  const pipelineDate = [];
  const holidayDateFilter = [];

  const filter = {};

  if (organization) {
    pipelineDate.push({ $eq: ['$organization', mongoose.Types.ObjectId(organization)] });
    filter.organization = mongoose.Types.ObjectId(organization);
  }

  if (grade) {
    filter.grade = mongoose.Types.ObjectId(grade);
  }

  if (from && to) {
    if (from) {
      pipelineDate.push({ $gte: ['$date', from] });
      holidayDateFilter.push({ $gte: ['$dates', from] });
    }

    if (to) {
      pipelineDate.push({ $lte: ['$date', to] });
      holidayDateFilter.push({ $lte: ['$dates', to] });
    }
  }

  const data = await User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id), ...filter },
    },
    {
      $lookup: {
        from: 'holidays',
        as: 'holidays',
        pipeline: [
          {
            $unwind: '$dates',
          },
          {
            $match: {
              $expr: {
                $and: [...holidayDateFilter],
              },
            },
          },
          {
            $project: {
              _id: 0,
              dates: 1,
              name: 1,
              organization: 1,
            },
          },
          {
            $group: {
              _id: 'dates',
              dates: {
                $addToSet: {
                  k: '$dates',
                  v: '$name',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              days: {
                $arrayToObject: '$dates',
              },
            },
          },
        ],
      },
    },
    { $unwind: { path: '$holidays', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'organizations',
        as: 'organization',
        let: { orgId: '$organization' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$orgId', '$_id'] }],
              },
            },
          },
          { $project: { name: 1, phone: 1, address: 1 } },
        ],
      },
    },
    { $unwind: { path: '$organization', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'classes',
        as: 'gradeData',
        let: { classId: '$grade' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$classId', '$_id'] }],
              },
            },
          },
          { $project: { name: 1 } },
        ],
      },
    },
    { $unwind: { path: '$gradeData', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'attendancelogs',
        as: 'attendanceLogs',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$userId', '$userId'] }, ...pipelineDate],
              },
            },
          },
          { $sort: { time: -1 } },
          { $project: { time: 1, date: 1 } },
          { $group: { _id: '$date', k: { $first: '$date' }, firstTime: { $first: '$time' }, lastTime: { $last: '$time' } } },
          { $project: { _id: 0, k: 1, v: ['$firstTime', '$lastTime'] } },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        first_name: 1,
        last_name: 1,
        phone: 1,
        grade: 1,
        section: 1,
        roll_no: 1,
        id: '$_id',
        userId: 1,
        gradeData: 1,
        role: 1,
        days: { $arrayToObject: '$attendanceLogs' },
        organization: 1,
        holidays: '$holidays.days',
      },
    },
  ]).allowDiskUse(true);

  return data;
};

const getClassTeacherStats = async (grade) => {
  const totalAttendeeCount = await Student.find({
    status: 'active',
    grade,
  })
    .select('userId')
    .lean();

  const userIds = totalAttendeeCount.map(({ userId }) => userId);
  const attendanceCount = await attendanceService.getTodayPresentUserIds({ userId: { $in: userIds } });

  return {
    present: attendanceCount?.length || 0,
    total: totalAttendeeCount?.length || 0,
  };
};

module.exports = {
  generateAttendanceReport,
  getAttendanceReport,
  getAttendanceReportIndividual,
  getAttendanceIndividualData,
  generateAttendanceIndividualReport,
  getAbsenseData,
  generateAbsenseReport,
  getClassTeacherStats,
};
