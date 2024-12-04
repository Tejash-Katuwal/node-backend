const express = require('express');
const auth = require('../../middlewares/auth');
const mobileController = require('../../controllers/mobile.controller');
const validate = require('../../middlewares/validate');
const mobileValidation = require('../../validations/mobile.validation');

const router = express.Router();

router.route('/').post(auth(), validate(mobileValidation.createMobile), mobileController.manageMobile);

router.route('/:mobileId').delete(auth(), validate(mobileValidation.deleteMobile), mobileController.deleteMobile);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Mobile
 *   description: User login mobile manage
 */
/**
 * @swagger
 * path:
 *  /mobile:
 *    post:
 *      summary: manage user mobile
 *      description: manage user mobile.
 *      tags: [Mobile]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - mobileId
 *                - user
 *                - pushTokenId
 *                - platform
 *              properties:
 *                mobileId:
 *                  type: string
 *                  description: logged in mobile id
 *                user:
 *                   type: string
 *                   description: logged in user
 *                pushTokenId:
 *                   type: string
 *                   description: push token id
 *                platform:
 *                   type: string
 *                   enum: [ios, android, windows]
 *              example:
 *                mobileId: D001
 *                user: 5f5509658910203c5ae16041
 *                pushTokenId: PT001
 *                platform: ios
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Mobile'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * path:
 *  /mobile/{mobileId}:
 *    delete:
 *      summary: Delete mobile
 *      description: Delete mobile
 *      tags: [Mobile]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: mobileId
 *          required: true
 *          schema:
 *            type: string
 *          description: mobile id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
