const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const tempUserValidation = require('../../validations/tempUser.validation');
const tempUserController = require('../../controllers/tempUser.controller');

const router = express.Router();

router.route('/').get(auth('getAll:tempUser'), validate(tempUserValidation.getTempUsers), tempUserController.getTempUsers);
// .post(
//   auth("create:tempUser"),
//   validate(tempUserValidation.createTempUser),
//   tempUserController.createTempUser
// );

router
  .route('/:id')
  .get(auth('get:tempUser'), validate(tempUserValidation.getTempUser), tempUserController.getTempUser)
  // .patch(auth('update:tempUser'), validate(tempUserValidation.updateTempUser), tempUserController.updateTempUser)
  .delete(auth('delete:tempUser'), validate(tempUserValidation.deleteTempUser), tempUserController.deleteTempUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TempUser
 *   description: TempUser management and retrieval
 */

/**
 * @swagger
 * /tempUser:
 *   post:
 *     summary: Create a tempUser
 *     description: Only admins can create other users.
 *     tags: [TempUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - validity
 *               - card_number
 *               - shift
 *               - email
 *               - role
 *             properties:
 *               validity:
 *                  type: string
 *               card_number:
 *                  type: string
 *               shift:
 *                  type: string
 *               username:
 *                  type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               role:
 *                  type: string
 *               first_name:
 *                  type: string
 *               last_name:
 *                  type: string
 *               fullname:
 *                  type: string
 *               image:
 *                  type: string
 *               phone:
 *                  type: string
 *               ward:
 *                  type: string
 *               fiscal:
 *                  type: string
 *               status:
 *                  type: string
 *               authMethod:
 *                  type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tempUser
 *     description: Only admins can retrieve all tempUser.
 *     tags: [TempUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
   * @swagger
   * /tempUser/{id}:
   *   get:
   *     summary: Get a tempUser
   *     description: tempUser.
   *     tags: [TempUser]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: TempUser id
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/User'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   *
   *   patch:
   *     summary: Update a tempUser
   *     description: tempUser.
   *     tags: [TempUser]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
  *               validity:
 *                  type: string
 *               card_number:
 *                  type: string
 *               shift:
 *                  type: string
 *               username:
 *                  type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               role:
 *                  type: string
 *               first_name:
 *                  type: string
 *               last_name:
 *                  type: string
 *               fullname:
 *                  type: string
 *               image:
 *                  type: string
 *               phone:
 *                  type: string
 *               ward:
 *                  type: string
 *               fiscal:
 *                  type: string
 *               status:
 *                  type: string
 *               authMethod:
 *                  type: string
 
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/User'
   *       "400":
   *         $ref: '#/components/responses/DuplicateEmail'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   *
   *   delete:
   *     summary: Delete a tempUser
   *     description: tempUser.
   *     tags: [TempUser]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User id
   *     responses:
   *       "200":
   *         description: No content
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
