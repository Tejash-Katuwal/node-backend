const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wardValidation = require('../../validations/ward.validation');
const wardController = require('../../controllers/ward.controller');
const fiscalYearInjector = require('../../middlewares/fiscalyearInjector');

const router = express.Router();

router
  .route('/')
  .post(auth('createWard'), validate(wardValidation.createWard), fiscalYearInjector, wardController.createWard)
  .get(validate(wardValidation.getWards), wardController.getWards);

router
  .route('/:id')
  .get(auth('getWard'), validate(wardValidation.getWard), wardController.getWard)
  .patch(auth('updateWard'), validate(wardValidation.updateWard), wardController.updateWard)
  .delete(auth('deleteWard'), validate(wardValidation.deleteWard), wardController.deleteWard);

router.route('/:id/users').get(auth(), validate(wardValidation.getWards), wardController.getWardUser);

module.exports = router;
