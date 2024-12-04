const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fiscalYearValidation = require('../../validations/fiscalyear.validation');
const fiscalYearController = require('../../controllers/fiscalyear.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createFiscalYear'), validate(fiscalYearValidation.createFiscalYear), fiscalYearController.createFiscalYear)
  .get(auth('getFiscalYears'), validate(fiscalYearValidation.getFiscalYears), fiscalYearController.getFiscalYears);

router
  .route('/active')
  .get(auth('getActiveFiscalYear'), fiscalYearController.getActiveFiscalYear)
  .patch(
    auth('activateFiscalYear'),
    validate(fiscalYearValidation.activateFiscalYear),
    fiscalYearController.activateFiscalYear
  );

router
  .route('/:id')
  .get(auth('getFiscalYear'), validate(fiscalYearValidation.getFiscalYear), fiscalYearController.getFiscalYear)
  .patch(auth('updateFiscalYear'), validate(fiscalYearValidation.updateFiscalYear), fiscalYearController.updateFiscalYear)
  .delete(auth('deleteFiscalYear'), validate(fiscalYearValidation.deleteFiscalYear), fiscalYearController.deleteFiscalYear);

module.exports = router;
