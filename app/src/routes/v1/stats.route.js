const express = require('express');

const router = express.Router();

const statsController = require('../../controllers/stats.controller');
const statsValidation = require('../../validations/stats.validation');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

router.route('/').get(auth('getStats'), validate(statsValidation.getStats), statsController.getStats);
router.route('/classwise').get(auth('getStats'), validate(statsValidation.getStats), statsController.getClassStats);

module.exports = router;
