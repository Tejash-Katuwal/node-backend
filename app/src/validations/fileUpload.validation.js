const httpStatus = require('http-status');
const { FILEFORMATS } = require('../config/enum');

const isFileValid = async (req, res, next) => {
  if (req.file) {
    if (FILEFORMATS.IMAGE.includes(req.file.mimetype)) {
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(httpStatus.FORBIDDEN).json({ message: 'फाइल आकार नाघ्यो !' });
      }
      return next();
    }
    return res.status(httpStatus.FORBIDDEN).json({ message: 'अमान्य फाइल !' });
  }
  return res.status(httpStatus.FORBIDDEN).json({ message: 'फाइल आवश्यक छ !' });
};

const isExcelValid = async (req, res, next) => {
  if (req.file) {
    if (FILEFORMATS.EXCEL.includes(req.file.mimetype)) {
      return next();
    }
    return res.status(httpStatus.FORBIDDEN).json({ message: 'अमान्य फाइल !' });
  }
  return res.status(httpStatus.FORBIDDEN).json({ message: 'फाइल आवश्यक छ !' });
};

module.exports = {
  isFileValid,
  isExcelValid,
};
