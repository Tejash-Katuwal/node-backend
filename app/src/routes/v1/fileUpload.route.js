const express = require('express');
const fileUploadController = require('../../controllers/fileUpload.controller');
const fileUploadValidation = require('../../validations/fileUpload.validation');
const upload = require('../../config/multer.config');

const router = express.Router();

router.route('/').post(upload.single('file'), fileUploadValidation.isFileValid, fileUploadController.storeFile);

module.exports = router;
