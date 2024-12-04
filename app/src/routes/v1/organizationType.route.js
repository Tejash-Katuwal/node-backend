const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const organizationTypeValidation = require('../../validations/organizationType.validation');
const organizationTypeController = require('../../controllers/organizationType.controller');

const router = express.Router();

router
  .route('/')
  .get(
    auth('getAll:organizationType'),
    validate(organizationTypeValidation.getOrganizationTypes),
    organizationTypeController.getOrganizationTypes
  )
  .post(
    auth('create:organizationType'),
    validate(organizationTypeValidation.createOrganizationType),
    organizationTypeController.createOrganizationType
  );

router
  .route('/:id')
  .get(
    auth('get:organizationType'),
    validate(organizationTypeValidation.getOrganizationType),
    organizationTypeController.getOrganizationType
  )
  .patch(
    auth('update:organizationType'),
    validate(organizationTypeValidation.updateOrganizationType),
    organizationTypeController.updateOrganizationType
  )
  .delete(
    auth('delete:organizationType'),
    validate(organizationTypeValidation.deleteOrganizationType),
    organizationTypeController.deleteOrganizationType
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: OrganizationType
 *   description: OrganizationType management and retrieval
 */

/**
 * @swagger
 * /organizationType:
 *   post:
 *     summary: Create a organizationType
 *     description: Only admins can create other users.
 *     tags: [OrganizationType]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_en
 *               - name_np
 *               - attendeeTypes
 *             properties:
 *               name_en:
 *                  type: string
 *               name_np:
 *                  type: string
 *               attendeeTypes:
 *                  type: array
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
 *     summary: Get all organizationType
 *     description: Only admins can retrieve all organizationType.
 *     tags: [OrganizationType]
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
   * /organizationType/{id}:
   *   get:
   *     summary: Get a organizationType
   *     description: organizationType.
   *     tags: [OrganizationType]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: OrganizationType id
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
   *     summary: Update a organizationType
   *     description: organizationType.
   *     tags: [OrganizationType]
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
  *               name_en:
 *                  type: string
 *               name_np:
 *                  type: string
 *               attendeeTypes:
 *                  type: array
 
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
   *     summary: Delete a organizationType
   *     description: organizationType.
   *     tags: [OrganizationType]
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
