const catchAsync = require('../utils/catchAsync');

const filePathInjector = (key = 'image') =>
  catchAsync(async (req, res, next) => {
    const { file } = req;
    if (file) {
      req.body[key] = `${req.protocol}://${req.hostname}/api/${file.path}`;
      next();
    } else {
      next();
    }
  });

module.exports = filePathInjector;
