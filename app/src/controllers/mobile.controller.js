const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const Mobile = require('../models/mobile.model');
const ApiError = require('../utils/ApiError');

/*
  store or update user mobile
*/
const manageMobile = catchAsync(async (req, res) => {
  const data = req.body;
  const existingMobile = await Mobile.findOne({ mobileId: data.mobileId });
  if (existingMobile) {
    Object.assign(existingMobile, { ...data, user: req.user.id });
    await existingMobile.save();
    res.status(httpStatus.OK).send(existingMobile);
  } else {
    const mobile = new Mobile({ ...data, user: req.user.id });
    mobile.save();
    res.status(httpStatus.OK).send(mobile);
  }
});

/*
  delete user mobile
*/
const deleteMobile = catchAsync(async (req, res) => {
  const { mobileId } = req.params;
  const existingMobile = await Mobile.findOne({ mobileId });
  if (!existingMobile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile not found');
  }
  await existingMobile.delete();
  res.status(httpStatus.OK).send();
});

module.exports = {
  manageMobile,
  deleteMobile,
};
