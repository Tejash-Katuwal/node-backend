const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fingerPrintValidaition = require('../../validations/fingerPrint.validation');
const fingerPrintController = require('../../controllers/fingerPrint.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getFingerPrints'), validate(fingerPrintValidaition.getFingerPrints), fingerPrintController.getFingerPrints);

router
  .route('/:id')
  .get(auth('getFingerPrint'), validate(fingerPrintValidaition.getFingerPrint), fingerPrintController.getFingerPrint);
router
  .route('/:id/applicants')
  .get(
    auth('getFingerPrintApplicant'),
    validate(fingerPrintValidaition.getFingerPrint),
    fingerPrintController.getFingerPrintApplicant
  );

module.exports = router;
