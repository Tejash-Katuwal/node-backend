const Device = require('../models/device.model');
const AttendanceLog = require('../models/attendanceLog.model');
const Class = require('../models/class.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { getCurrentDate } = require('../services/calendar.service');
const mongoose = require('mongoose');

const getStats = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['organization']);
  const today = new Date().toISOString().split('T')[0];

  const [deviceCount, attendanceCount, totalAttendeeCount] = await Promise.all([
    await Device.countDocuments(filter),
    await AttendanceLog.count({
      time: { $regex: today, $options: 'i' },
      ...filter,
    }).distinct('userId'),
    await User.countDocuments({ role: { $in: ['student', 'employee', 'teacher'] }, status: 'active', ...filter }),
  ]);
  res.send({
    data: {
      device: { count: deviceCount },
      attendance: { count: attendanceCount?.length || 0 },
      totalAttendee: { count: totalAttendeeCount },
    },
    message: 'Stats',
  });
});

const getClassStats = catchAsync(async (req, res) => {
  const today = getCurrentDate();
  const filter = pick(req.query, ['organization']);
  if (filter.organization) filter.organization = mongoose.Types.ObjectId(filter.organization);
  const data = await Class.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        as: 'usersCount',
        let: { gradeId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$gradeId', '$grade'] }, { $eq: ['active', '$status'] }],
              },
            },
          },
          { $project: { userId: 1 } },
          { $group: { _id: 'userIds', userIds: { $push: '$userId' }, count: { $sum: 1 } } },
        ],
      },
    },
    { $unwind: { path: '$usersCount', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        usersCount: {
          userIds: {
            $cond: {
              if: {
                $eq: [{ $type: '$usersCount.userIds' }, 'array'],
              },
              then: '$usersCount.userIds',
              else: [],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'attendancelogs',
        as: 'presentCount',
        let: { userIds: '$usersCount.userIds' },
        pipeline: [
          { $match: { $expr: { $and: [{ $in: ['$userId', '$$userIds'] }, { $eq: ['$date', today] }] } } },
          { $project: { userId: 1 } },
          {
            $group: { _id: 'counts', count: { $addToSet: '$userId' } },
          },
          { $project: { count: { $size: '$count' } } },
        ],
      },
    },
    { $unwind: { path: '$presentCount', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        grade_text: 1,
        section_text: 1,
        usersCount: { $ifNull: ['$usersCount.count', 0] },
        presentCount: { $ifNull: ['$presentCount.count', 0] },
      },
    },
  ]);
  res.send(data);
});

module.exports = {
  getStats,
  getClassStats,
};
