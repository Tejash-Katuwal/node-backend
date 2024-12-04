const catchAsync = require('../utils/catchAsync');

/*
  store Task
*/
const storeFile = catchAsync(async (req, res) => {
  const { file } = req;
  if (file) {
    res.send({
      data: `${req.protocol}://${req.hostname}/api/${file.path}`,
    });
  } else {
    res.send({});
  }
});

module.exports = {
  storeFile,
};
