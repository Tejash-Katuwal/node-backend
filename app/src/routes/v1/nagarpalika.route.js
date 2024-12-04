const express = require('express');
const auth = require('../../middlewares/auth');
const nagarpalikaController = require('../../controllers/nagarpalika.controller');
const validate = require('../../middlewares/validate');
const nagarpalikaValidation = require('../../validations/nagarpalika.validation');

const router = express.Router();

router
  .route('/')
  .get(nagarpalikaController.getNagarpalika)
  .patch(
    auth('updateNagarpalika'),
    validate(nagarpalikaValidation.updateNagarpalika),
    nagarpalikaController.updateNagarpalika
  );

module.exports = router;
