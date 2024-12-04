const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const teacherValidation = require('../../validations/teacher.validation');
const teacherController = require('../../controllers/teacher.controller');
const upload = require('../../config/multer.config');
const filePathInjector = require('../../middlewares/filePathInjector');

const router = express.Router();

router
  .route('/')
  .get(auth('getAll:teacher'), validate(teacherValidation.getTeachers), teacherController.getTeachers)
  .post(
    upload.single('image'),
    auth('create:teacher'),
    filePathInjector('image'),
    validate(teacherValidation.createTeacher),
    teacherController.createTeacher
  );

router
  .route('/:id')
  .get(auth('get:teacher'), validate(teacherValidation.getTeacher), teacherController.getTeacher)
  .patch(
    upload.single('image'),
    auth('update:teacher'),
    filePathInjector('image'),
    validate(teacherValidation.updateTeacher),
    teacherController.updateTeacher
  )
  .delete(auth('delete:teacher'), validate(teacherValidation.deleteTeacher), teacherController.deleteTeacher);

router
  .route('/:id/verify')
  .post(
    upload.single('image'),
    auth('create:teacher'),
    filePathInjector('image'),
    validate(teacherValidation.createTeacher),
    teacherController.verifyTeacher
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher management and retrieval
 */

/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Create a teacher
 *     description: Only admins can create other users.
 *     tags: [Teacher]
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
 *     summary: Get all teacher
 *     description: Only admins can retrieve all teacher.
 *     tags: [Teacher]
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
   * /teacher/{id}:
   *   get:
   *     summary: Get a teacher
   *     description: teacher.
   *     tags: [Teacher]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Teacher id
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
   *     summary: Update a teacher
   *     description: teacher.
   *     tags: [Teacher]
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
   *     summary: Delete a teacher
   *     description: teacher.
   *     tags: [Teacher]
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
