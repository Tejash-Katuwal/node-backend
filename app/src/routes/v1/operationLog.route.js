const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const operationLogValidation = require('../../validations/operationLog.validation');
const operationLogController = require('../../controllers/operationLog.controller');

const router = express.Router();

router
  .route('/')
  .get(
    auth('getAll:operationLog'),
    validate(operationLogValidation.getOperationLogs),
    operationLogController.getOperationLogs
  );
// .post(
//   auth('create:operationLog'),
//   validate(operationLogValidation.createOperationLog),
//   operationLogController.createOperationLog
// );

router
  .route('/:id')
  .get(auth('get:operationLog'), validate(operationLogValidation.getOperationLog), operationLogController.getOperationLog);
// .patch(
//   auth('update:operationLog'),
//   validate(operationLogValidation.updateOperationLog),
//   operationLogController.updateOperationLog
// )
// .delete(
//   auth('delete:operationLog'),
//   validate(operationLogValidation.deleteOperationLog),
//   operationLogController.deleteOperationLog
// );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: OperationLog
 *   description: OperationLog management and retrieval
 */

/**
 * @swagger
 * /operationLog:
 *   post:
 *     summary: Create a operationLog
 *     description: Only admins can create other users.
 *     tags: [OperationLog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                  type: string
 *               type:
 *                  type: string
 *               time:
 *                  type: string
 *               value1:
 *                  type: string
 *               value2:
 *                  type: string
 *               value3:
 *                  type: string
 *               reserved:
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
 *     summary: Get all operationLog
 *     description: Only admins can retrieve all operationLog.
 *     tags: [OperationLog]
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
   * /operationLog/{id}:
   *   get:
   *     summary: Get a operationLog
   *     description: operationLog.
   *     tags: [OperationLog]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: OperationLog id
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
   *     summary: Update a operationLog
   *     description: operationLog.
   *     tags: [OperationLog]
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
  *               userId:
 *                  type: string
 *               type:
 *                  type: string
 *               time:
 *                  type: string
 *               value1:
 *                  type: string
 *               value2:
 *                  type: string
 *               value3:
 *                  type: string
 *               reserved:
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
   *     summary: Delete a operationLog
   *     description: operationLog.
   *     tags: [OperationLog]
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
