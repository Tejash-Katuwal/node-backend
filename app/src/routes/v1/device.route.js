const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const deviceValidation = require('../../validations/device.validation');
const deviceController = require('../../controllers/device.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getAll:device'), validate(deviceValidation.getDevices), deviceController.getDevices)
  .post(auth('create:device'), validate(deviceValidation.createDevice), deviceController.createDevice);

router
  .route('/:id')
  .get(auth('get:device'), validate(deviceValidation.getDevice), deviceController.getDevice)
  .patch(auth('update:device'), validate(deviceValidation.updateDevice), deviceController.updateDevice)
  .delete(auth('delete:device'), validate(deviceValidation.deleteDevice), deviceController.deleteDevice);

router
  .route('/:serial_number/sync-user')
  .post(auth('sync:user'), validate(deviceValidation.syncDevice), deviceController.syncUserFromDevice);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Device
 *   description: Device management and retrieval
 */

/**
 * @swagger
 * /device:
 *   post:
 *     summary: Create a device
 *     description: Only admins can create other users.
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - baudrate
 *               - serial_number
 *               - type
 *               - protocol
 *               - address
 *               - power
 *               - max_scan_time
 *               - min_frequency
 *               - max_frequency
 *               - mode
 *               - version
 *               - sub_version
 *             properties:
 *               name:
 *                  type: string
 *               baudrate:
 *                  type: string
 *               serial_number:
 *                  type: string
 *               type:
 *                  type: string
 *               protocol:
 *                  type: string
 *               address:
 *                  type: string
 *               power:
 *                  type: string
 *               max_scan_time:
 *                  type: string
 *               min_frequency:
 *                  type: string
 *               max_frequency:
 *                  type: string
 *               mode:
 *                  type: number
 *               version:
 *                  type: string
 *               sub_version:
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
 *     summary: Get all device
 *     description: Only admins can retrieve all device.
 *     tags: [Device]
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
   * /device/{id}:
   *   get:
   *     summary: Get a device
   *     description: device.
   *     tags: [Device]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Device id
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
   *     summary: Update a device
   *     description: device.
   *     tags: [Device]
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
  *               name:
 *                  type: string
 *               baudrate:
 *                  type: string
 *               serial_number:
 *                  type: string
 *               type:
 *                  type: string
 *               protocol:
 *                  type: string
 *               address:
 *                  type: string
 *               power:
 *                  type: string
 *               max_scan_time:
 *                  type: string
 *               min_frequency:
 *                  type: string
 *               max_frequency:
 *                  type: string
 *               mode:
 *                  type: number
 *               version:
 *                  type: string
 *               sub_version:
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
   *     summary: Delete a device
   *     description: device.
   *     tags: [Device]
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
