const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const studentValidation = require('../../validations/student.validation');
const studentController = require('../../controllers/student.controller');
const upload = require('../../config/multer.config');
const filePathInjector = require('../../middlewares/filePathInjector');

const router = express.Router();

router
  .route('/')
  .get(auth('getAll:student'), validate(studentValidation.getStudents), studentController.getStudents)
  .post(
    upload.single('image'),
    auth('create:student'),
    filePathInjector('image'),
    validate(studentValidation.createStudent),
    studentController.createStudent
  );

router
  .route('/:id')
  .get(auth('get:student'), validate(studentValidation.getStudent), studentController.getStudent)
  .patch(
    upload.single('image'),
    auth('update:student'),
    filePathInjector('image'),
    validate(studentValidation.updateStudent),
    studentController.updateStudent
  )
  .delete(auth('delete:student'), validate(studentValidation.deleteStudent), studentController.deleteStudent);

router
  .route('/:id/verify')
  .post(
    upload.single('image'),
    auth('create:student'),
    filePathInjector('image'),
    validate(studentValidation.createStudent),
    studentController.verifyStudent
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student management and retrieval
 */

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a student
 *     description: Only admins can create other users.
 *     tags: [Student]
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
 *               grade:
 *                  type: string
 *               roll_no:
 *                  type: string
 *               section:
 *                  type: string
 *               date_of_birth_ad:
 *                  type: string
 *               date_of_birth_bs:
 *                  type: string
 *               department:
 *                  type: string
 *               address:
 *                  type: string
 *               father_name:
 *                  type: string
 *               mother_name:
 *                  type: string
 *               guardian_name:
 *                  type: string
 *               guardian_phone:
 *                  type: string
 *               guardian_email:
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
 *     summary: Get all student
 *     description: Only admins can retrieve all student.
 *     tags: [Student]
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
   * /student/{id}:
   *   get:
   *     summary: Get a student
   *     description: student.
   *     tags: [Student]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Student id
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
   *     summary: Update a student
   *     description: student.
   *     tags: [Student]
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
 *               grade:
 *                  type: string
 *               roll_no:
 *                  type: string
 *               section:
 *                  type: string
 *               date_of_birth_ad:
 *                  type: string
 *               date_of_birth_bs:
 *                  type: string
 *               department:
 *                  type: string
 *               address:
 *                  type: string
 *               father_name:
 *                  type: string
 *               mother_name:
 *                  type: string
 *               guardian_name:
 *                  type: string
 *               guardian_phone:
 *                  type: string
 *               guardian_email:
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
   *     summary: Delete a student
   *     description: student.
   *     tags: [Student]
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
