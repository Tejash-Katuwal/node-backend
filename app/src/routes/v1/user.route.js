const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const fiscalYearInjector = require('../../middlewares/fiscalyearInjector');
const meController = require('../../controllers/me.controller');
// const upload = require('../../config/multer.config');
// const filePathInjector = require('../../middlewares/filePathInjector');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageUsers'),
    // upload.single('image'),
    // filePathInjector('image'),
    validate(userValidation.createUser),
    fiscalYearInjector,
    userController.createUser
  )
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router.route('/me').get(auth(), meController.getMe).patch(auth(), validate(userValidation.updateMe), meController.updateMe);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(
    auth('manageUsers'),
    // upload.single('image'),
    // filePathInjector('image'),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
