const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const organizationValidation = require('../../validations/organization.validation');
const organizationController = require('../../controllers/organization.controller');
const upload = require('../../config/multer.config');
const filePathInjector = require('../../middlewares/filePathInjector');

const router = express.Router();

router
  .route('/')
  .get(
    auth('getAll:organization'),
    validate(organizationValidation.getOrganizations),
    organizationController.getOrganizations
  )
  .post(
    upload.single('image'),
    auth('create:organization'),
    filePathInjector('image'),
    validate(organizationValidation.createOrganization),
    organizationController.createOrganization
  );

router.route('/:id/departments').get(
  auth('get:department'),
  validate(organizationValidation.getOrganization),
  (req, res, next) => {
    req.query.organization = req.params.id;
    next();
  },
  organizationController.getOrganizations
);

router
  .route('/:id')
  .get(auth('get:organization'), validate(organizationValidation.getOrganization), organizationController.getOrganization)
  .post(
    auth('create:organization'),
    validate(organizationValidation.createOrganization),
    (req, res, next) => {
      req.body.organization = req.params.id;
      req.body.type = 'department';
      next();
    },
    organizationController.createOrganization
  )
  .patch(
    upload.single('image'),
    auth('update:organization'),
    filePathInjector('image'),
    validate(organizationValidation.updateOrganization),
    organizationController.updateOrganization
  )
  .delete(
    auth('delete:organization'),
    validate(organizationValidation.deleteOrganization),
    organizationController.deleteOrganization
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management and retrieval
 */

/**
 * @swagger
 * /organization:
 *   post:
 *     summary: Create a organization
 *     description: Only admins can create other users.
 *     tags: [Organization]
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
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                  type: string
 *               phone:
 *                  type: string
 *               address:
 *                  type: string
 *               device:
 *                  type: string
 *               type:
 *                  type: string
 *               organization:
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
 *     summary: Get all organization
 *     description: Only admins can retrieve all organization.
 *     tags: [Organization]
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
   * /organization/{id}:
   *   get:
   *     summary: Get a organization
   *     description: organization.
   *     tags: [Organization]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Organization id
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
   *     summary: Update a organization
   *     description: organization.
   *     tags: [Organization]
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
 *               phone:
 *                  type: string
 *               address:
 *                  type: string
 *               device:
 *                  type: string
 *               type:
 *                  type: string
 *               organization:
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
   *     summary: Delete a organization
   *     description: organization.
   *     tags: [Organization]
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
