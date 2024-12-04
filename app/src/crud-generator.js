const {
  // existsSync,
  writeFile: _writeFile,
} = require('fs');

// const { error, info } = require("./config/logger");

const templates = {
  controller: ({ name, capitalized }) =>
    `
      const httpStatus = require("http-status");
      const pick = require("../utils/pick");
      const ApiError = require("../utils/ApiError");
      const catchAsync = require("../utils/catchAsync");
      const ${name}Service  = require("../services/${name}.service");
      
      const get${capitalized}s = catchAsync(async (req, res) => {
        const filter = pick(req.query, ["name"]);
        if (filter.name) {
          filter.name = { $regex: filter.name, $options: "" };
        }
        const options = pick(req.query, ["sortBy", "limit", "page"]);
        const result = await ${name}Service.get${capitalized}s(filter, options);
        res.send({ data: result, message: "${name} lists" });
      });
      
      const create${capitalized} = catchAsync(async (req, res) => {
        const ${name} = await ${name}Service.create${capitalized}({
          ...req.body,
          createdBy: req.user.id,
        });
        res.status(httpStatus.CREATED).send({ data: ${name}, message: "${name} created" });
      });
      
      const get${capitalized} = catchAsync(async (req, res) => {
        const ${name} = await ${name}Service.get${capitalized}ById(req.params.id);
        if (!${name}) {
          throw new ApiError(httpStatus.NOT_FOUND, "${name} फेला परेन");
        }
        res.send({ data: ${name}, message: "${name} detail" });
      });
      
      const update${capitalized} = catchAsync(async (req, res) => {
        const ${name} = await ${name}Service.update${capitalized}ById(req.params.id, {
          ...req.body,
          updatedBy: req.user.id,
        });
        res.send({ data: ${name}, message: "${name} updated" });
      });
      
      const delete${capitalized} = catchAsync(async (req, res) => {
        await ${name}Service.delete${capitalized}ById(req.params.id);
        res.status(httpStatus.NO_CONTENT).send();
      });
      
      module.exports = {
        get${capitalized}s,
        create${capitalized},
        get${capitalized},
        update${capitalized},
        delete${capitalized},
      };`,

  service: ({ name, capitalized }) => `
    const httpStatus = require("http-status");
    const ${capitalized} = require("../models/${name}.model");
    const ApiError = require("../utils/ApiError");
    
    /**
     * Query for ${name}
     * @param {Object} filter - Mongo filter
     * @param {Object} options - Query options
     * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    const get${capitalized}s = async (filter, options) => {
      const ${name} = await ${capitalized}.paginate(filter, options);
      return ${name};
    };
    
    /**
     * Create a ${capitalized}
     * @param {Object} ${name}Body
     * @returns {Promise<${capitalized}>}
     */
    const create${capitalized} = async (${name}Body) => {
      const created${capitalized} = await ${capitalized}.create(${name}Body);
    
      return created${capitalized};
    };
    
    /**
     * Get ${capitalized} by id
     * @param {ObjectId} id
     * @returns {Promise<${capitalized}>}
     */
    const get${capitalized}ById = async (id) => {
      return ${capitalized}.findById(id);
    };
    
    /**
     * Update ${capitalized} by id
     * @param {ObjectId} ${capitalized}Id
     * @param {Object} updateBody
     * @returns {Promise<${capitalized}>}
     */
    const update${capitalized}ById = async (${name}Id, updateBody) => {
      const ${name} = await get${capitalized}ById(${name}Id);
      if (!${name}) {
        throw new ApiError(httpStatus.NOT_FOUND, "${capitalized} फेला परेन");
      }
    
      Object.assign(${name}, updateBody);
      await ${name}.save();
      return ${name};
    };
    
    /**
     * Delete ${name} by id
     * @param {ObjectId} ${name}Id
     * @returns {Promise<ANM>}
     */
    const delete${capitalized}ById = async (${name}Id) => {
      const ${name} = await get${capitalized}ById(${name}Id);
      if (!${name}) {
        throw new ApiError(httpStatus.NOT_FOUND, "${capitalized} फेला परेन");
      }
      await ${name}.remove();
      return ${name};
    };
    
    module.exports = {
      get${capitalized}s,
      create${capitalized},
      get${capitalized}ById,
      update${capitalized}ById,
      delete${capitalized}ById,
    };
    `,

  route: ({ name, capitalized, required, property }) => `
    const express = require("express");
    const auth = require("../../middlewares/auth");
    const validate = require("../../middlewares/validate");
  
    const ${name}Validation = require("../../validations/${name}.validation");
    const ${name}Controller = require("../../controllers/${name}.controller");
  
    const router = express.Router();
  
    router
      .route("/")
      .get(auth("getAll:${name}"), validate(${name}Validation.get${capitalized}s), ${name}Controller.get${capitalized}s)
      .post(
        auth("create:${name}"),
        validate(${name}Validation.create${capitalized}),
        ${name}Controller.create${capitalized}
      );
  
    router
      .route("/:id")
      .get(auth("get:${name}"), validate(${name}Validation.get${capitalized}), ${name}Controller.get${capitalized})
      .patch(
        auth("update:${name}"),
        validate(${name}Validation.update${capitalized}),
        ${name}Controller.update${capitalized}
      )
      .delete(
        auth("delete:${name}"),
        validate(${name}Validation.delete${capitalized}),
        ${name}Controller.delete${capitalized}
      );
  
    module.exports = router;
  
    /**
   * @swagger
   * tags:
   *   name: ${capitalized}
   *   description: ${capitalized} management and retrieval
   */
  
  /**
   * @swagger
   * /${name}:
   *   post:
   *     summary: Create a ${name}
   *     description: Only admins can create other users.
   *     tags: [${capitalized}]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
  ${required.map((r, i) => (i !== required.length - 1 ? ` *               - ${r}\n` : ` *               - ${r}`)).join('')}
   *             properties:
  ${property
    .map((p, i) =>
      i !== property.length - 1
        ? ` *               ${p.property}:\n *                  type: ${p.type}\n`
        : ` *               ${p.property}:\n *                  type: ${p.type}`
    )
    .join('')}
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
   *     summary: Get all ${name}
   *     description: Only admins can retrieve all ${name}.
   *     tags: [${capitalized}]
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
   * /${name}/{id}:
   *   get:
   *     summary: Get a ${name}
   *     description: ${name}.
   *     tags: [${capitalized}]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ${capitalized} id
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
   *     summary: Update a ${name}
   *     description: ${name}.
   *     tags: [${capitalized}]
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
  ${property.map((p) => `*               ${p.property}:\n *                  type: ${p.type}\n `).join('')}
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
   *     summary: Delete a ${name}
   *     description: ${name}.
   *     tags: [${capitalized}]
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
    `,

  validation: ({ capitalized, validationSchemaCreate, validationSchemaUpdate }) => `
    const Joi = require("joi");
    const { objectId } = require("./custom.validation");
  
    const get${capitalized}s = {
      query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
      }),
    };
  
    const create${capitalized} = {
      body: Joi.object().keys(${JSON.stringify(validationSchemaCreate).replace(/"/g, '')}),
    };
  
    const get${capitalized} = {
      params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
      }),
    };
  
    const update${capitalized} = {
      params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
      }),
      body: Joi.object()
        .keys((${JSON.stringify(validationSchemaUpdate).replace(/"/g, ' ')}))
        .min(1),
    };
  
    const delete${capitalized} = {
      params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
      }),
    };
  
    module.exports = {
      get${capitalized}s,
      create${capitalized},
      get${capitalized},
      update${capitalized},
      delete${capitalized},
    };
    `,
};

// const fileExists = (path) => (file) => existsSync(`${path}/${file}`);

const writeToPath = (path) => (file, content) => {
  const filePath = `${path}/${file}`;

  _writeFile(filePath, content, (err) => {
    if (err) throw err;
    console.log('Created file: ', filePath);
    return true;
  });
};

function createFiles(path, name) {
  if (!name) {
    console.log('Name of Model is Required. Eg: npm crud user');
    return;
  }
  const files = {
    controller: `controllers/${name}.controller.js`,
    service: `services/${name}.service.js`,
    route: `routes/v1/${name}.route.js`,
    validation: `validations/${name}.validation.js`,
  };

  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

  // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require, global-require
  const model = require(`${__dirname}/models/${name}.model.js`);
  const validationSchemaCreate = {};
  const validationSchemaUpdate = {};
  const requiredField = [];
  const properties = [];

  Object.keys(model.schema.obj).forEach((property) => {
    const { instance: type, isRequired } = model.schema.path(property);
    if (isRequired) {
      requiredField.push(property);
    }
    switch (type) {
      case 'ObjectID':
        validationSchemaCreate[property] = isRequired
          ? 'Joi.string().required().custom(objectId)'
          : 'Joi.string().custom(objectId)';
        validationSchemaUpdate[property] = 'Joi.string().custom(objectId)';
        properties.push({ property, type: 'string' });
        break;

      case 'String':
        validationSchemaCreate[property] = isRequired ? 'Joi.string().required()' : 'Joi.string()';
        validationSchemaUpdate[property] = 'Joi.string()';
        properties.push({ property, type: 'string' });
        break;

      case 'Number':
        validationSchemaCreate[property] = isRequired ? 'Joi.number().required()' : 'Joi.number()';
        validationSchemaUpdate[property] = 'Joi.number()';
        properties.push({ property, type: 'number' });

        break;

      case 'Array':
        validationSchemaCreate[property] = isRequired ? 'Joi.array().required()' : 'Joi.array()';
        validationSchemaUpdate[property] = 'Joi.array()';
        properties.push({ property, type: 'array' });

        break;

      default:
        break;
    }
  });

  const writeFile = writeToPath(path);
  // const toFileMissingBool = (file) => !fileExists(path)(file);
  // const checkAllMissing = (acc, cur) => acc && cur;

  // const noneExist = Object.values(files)
  //   .map(toFileMissingBool)
  //   .reduce(checkAllMissing);

  // if (noneExist) {
  console.log(`Detected new file: ${name}, ${path}`);
  Object.entries(files).forEach(([type, fileName]) => {
    writeFile(
      fileName,
      templates[type]({
        name,
        capitalized,
        validationSchemaCreate,
        validationSchemaUpdate,
        required: requiredField,
        property: properties,
      })
    );
  });
  // }
}

const arg = process.argv[2];

createFiles(__dirname, arg);
