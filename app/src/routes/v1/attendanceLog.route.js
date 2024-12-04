const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const attendanceLogValidation = require('../../validations/attendanceLog.validation');
const attendanceLogController = require('../../controllers/attendanceLog.controller');

const router = express.Router();

router
  .route('/')
  .get(
    auth('getAll:attendanceLog'),
    validate(attendanceLogValidation.getAttendanceLogs),
    attendanceLogController.getAttendanceLogs
  );
// .post(
//   auth('create:attendanceLog'),
//   validate(attendanceLogValidation.createAttendanceLog),
//   attendanceLogController.createAttendanceLog
// );

router
  .route('/:id')
  .get(
    auth('get:attendanceLog'),
    validate(attendanceLogValidation.getAttendanceLog),
    attendanceLogController.getAttendanceLog
  );
// .patch(
//   auth('update:attendanceLog'),
//   validate(attendanceLogValidation.updateAttendanceLog),
//   attendanceLogController.updateAttendanceLog
// )
// .delete(
//   auth('delete:attendanceLog'),
//   validate(attendanceLogValidation.deleteAttendanceLog),
//   attendanceLogController.deleteAttendanceLog
// );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AttendanceLog
 *   description: AttendanceLog management and retrieval
 */

/**
 * @swagger
 * /attendanceLog:
 *   post:
 *     summary: Create a attendanceLog
 *     description: Only admins can create other users.
 *     tags: [AttendanceLog]
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
 *               - time
 *             properties:
 *               userId:
 *                  type: string
 *               time:
 *                  type: string
 *               status:
 *                  type: string
 *               verify:
 *                  type: string
 *               workcode:
 *                  type: string
 *               IDNum:
 *                  type: string
 *               type:
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
 *     summary: Get all attendanceLog
 *     description: Only admins can retrieve all attendanceLog.
 *     tags: [AttendanceLog]
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
   * /attendanceLog/{id}:
   *   get:
   *     summary: Get a attendanceLog
   *     description: attendanceLog.
   *     tags: [AttendanceLog]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: AttendanceLog id
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
   *     summary: Update a attendanceLog
   *     description: attendanceLog.
   *     tags: [AttendanceLog]
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
 *               time:
 *                  type: string
 *               status:
 *                  type: string
 *               verify:
 *                  type: string
 *               workcode:
 *                  type: string
 *               IDNum:
 *                  type: string
 *               type:
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
   *     summary: Delete a attendanceLog
   *     description: attendanceLog.
   *     tags: [AttendanceLog]
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
