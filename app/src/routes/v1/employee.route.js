const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const employeeValidation = require('../../validations/employee.validation');
const employeeController = require('../../controllers/employee.controller');
const upload = require('../../config/multer.config');
const filePathInjector = require('../../middlewares/filePathInjector');

const router = express.Router();

router
  .route('/')
  .get(auth('getAll:employee'), validate(employeeValidation.getEmployees), employeeController.getEmployees)
  .post(
    upload.single('image'),
    auth('create:employee'),
    filePathInjector('image'),
    validate(employeeValidation.createEmployee),
    employeeController.createEmployee
  );

router
  .route('/:id')
  .get(auth('get:employee'), validate(employeeValidation.getEmployee), employeeController.getEmployee)
  .patch(
    upload.single('image'),
    auth('update:employee'),
    filePathInjector('image'),
    validate(employeeValidation.updateEmployee),
    employeeController.updateEmployee
  )
  .delete(auth('delete:employee'), validate(employeeValidation.deleteEmployee), employeeController.deleteEmployee);

router
  .route('/:id/verify')
  .post(
    upload.single('image'),
    auth('create:employee'),
    filePathInjector('image'),
    validate(employeeValidation.createEmployee),
    employeeController.verifyEmployee
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee management and retrieval
 */

/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Create a employee
 *     description: Only admins can create other users.
 *     tags: [Employee]
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
 *     summary: Get all employee
 *     description: Only admins can retrieve all employee.
 *     tags: [Employee]
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
   * /employee/{id}:
   *   get:
   *     summary: Get a employee
   *     description: employee.
   *     tags: [Employee]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Employee id
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
   *     summary: Update a employee
   *     description: employee.
   *     tags: [Employee]
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
   *     summary: Delete a employee
   *     description: employee.
   *     tags: [Employee]
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
