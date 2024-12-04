const httpStatus = require('http-status');
const mongoose = require('mongoose');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wardService, userService } = require('../services');

const createWard = catchAsync(async (req, res) => {
  // const session = await mongoose.connection.startSession();
  try {
    // session.startTransaction();
    const id = mongoose.Types.ObjectId().toString();
    await userService.createMultipleUser(
      [
        { ...req.body.ward_admin, ward: id },
        { ...req.body.ward_user, ward: id },
      ]
      // { session }
    );
    const ward = await wardService.createWard(
      [{ _id: id, ...req.body }]
      // { session }
    );
    // await session.commitTransaction();
    // session.endSession();
    res.status(httpStatus.CREATED).send({ data: ward, message: 'Ward created' });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
});

const getWards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  const result = await wardService.queryWards(filter, options);
  res.send({ data: result, messaage: 'ward lists' });
});

const getWard = catchAsync(async (req, res) => {
  const ward = await wardService.getWardById(req.params.id);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ward भेटिएन । ');
  }
  res.send({ data: ward, message: 'ward details' });
});

const updateWard = catchAsync(async (req, res) => {
  const ward = await wardService.updateWardById(req.params.id, req.body);
  res.send({ data: ward, message: 'ward updated' });
});

const deleteWard = catchAsync(async (req, res) => {
  await wardService.deleteWardById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getWardUser = catchAsync(async (req, res) => {
  const filter = { ward: req.params.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send({ data: result.results, messaage: 'ward user lists' });
});

module.exports = {
  createWard,
  getWards,
  getWard,
  updateWard,
  deleteWard,
  getWardUser,
};
