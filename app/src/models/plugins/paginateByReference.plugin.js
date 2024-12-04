const { isValidObjectId } = require('mongoose');

/**
 * Error messages object, containing error messages in  English
 */
const messages = {
  schemaTypeError: {
    'en-US': 'param "schema" type must be "Schema".',
  },
  modelCountError: {
    'en-US': 'The number of models accessed is 0 or does not exist.',
  },
};

/**
 * Translation function, returns error messages in the language corresponding to the value of the LANG environment variable
 * @param messageId -  ID
 * @param messageId - ID of the error message
 */
function i18n(messageId) {
  if (messageId in messages) {
    const message = messages[messageId];
    const lang = process.env.LANG ?? '';
    if (lang) return message[lang];
    else return message['en-US'];
  }
}

/**
 * paginateByReference function, used to find data by reference in Mongoose
 * @param schema - Mongoose Schema
 * @param schema - The Schema object of Mongoose
 */
function paginateByReference(schema) {
  // Throw an error if the received is not a Schema
  if (schema.constructor.name !== 'Schema') throw new Error(i18n('schemaTypeError'));

  // Hook on the Schema
  schema.statics.paginateByReference = async function (filter = {}, options = {}) {
    /*
     *  Current Models */
    const models = this.db.models;

    // Check Models for emptiness
    if (Object.keys(models ?? {}).length === 0) throw new Error(i18n('modelCountError'));

    /*
     *  Current Schema */
    const schema = this.schema;

    /**
     * Return the Model which connected with Ref Path.
     * @param obj
     * @returns
     */
    function getModel(obj) {
      let refKey = '';
      if (obj?.instance === 'ObjectID' || obj?.instance === 'ObjectId') {
        // If it is Ref Path, read it directly
        const options = obj.options;
        if (options?.ref?.length) {
          refKey = options.ref;
        }
      } else if (obj?.$embeddedSchemaType) {
        // If it is an array, read the subitem Type
        return getModel(obj.$embeddedSchemaType);
      }

      return models[refKey];
    }

    /**
     * Transforms a path array into a reference path array
     * @param paths - The path array to be transformed
     * @param tSchema - Mongoose Schema , Schema
     * @param tSchema - The current Mongoose Schema object, default is the main Schema
     * @returns The transformed reference path array
     * @examples ['owner','name','en-US']  => ['owner', 'name.en-US']
     */
    function transPath2RefPath(paths, tSchema = schema) {
      let previousPath = [];

      // If there are still paths that have not been converted
      while (paths.length > 0) {
        const path = paths.shift() ?? '';

        // If the Schema has this path
        if (tSchema.path([...previousPath, path].join('.'))) {
          previousPath.push(path);
        } else {
          const currentModel = getModel(tSchema.path(previousPath.join('.')));
          if (currentModel) {
            const recurseResult = transPath2RefPath([path, ...paths], currentModel.schema);
            if (!paths.length) {
              return [previousPath.join('.'), ...recurseResult];
            } else {
              previousPath.push(...recurseResult);
            }
          } else return [...previousPath, path];
        }
      }
      return previousPath;
    }

    function flatten(dd, separator = '.', prefix = '') {
      let result = {};

      for (let [k, v] of Object.entries(dd)) {
        let key = prefix ? `${prefix}${separator}${k}` : k;

        if (v.constructor === Object && !Object.keys(v).some((checkKey) => checkKey.startsWith('$'))) {
          let flatObject = flatten(v, separator, key);
          result = { ...result, ...flatObject };
        } else {
          result[key] = v;
        }
      }

      return result;
    }

    async function lookup(prevPaths, conditions, cSchema = schema) {
      // If Conditions cannot be analyzed, return it directly
      if (typeof conditions !== 'object' || conditions === null || Object.keys(conditions).length === 0) {
        return conditions;
      }

      /**  Final result */
      const result = {};

      /**
       * Get the value of the previous Path
       */
      const prevPathsValue = cSchema.path(prevPaths.join('.'));

      for (let [paths, value] of Object.entries(conditions)) {
        // Determine whether Paths exists on Schema
        if (schema.path(paths)) {
        } else {
          const reduceResult = [...transPath2RefPath(paths.split('.')), value].reduceRight((previousValue, currentValue) =>
            currentValue === '$' ? previousValue : { [currentValue]: previousValue }
          );
          [[paths, value]] = Object.entries(reduceResult);
        }

        // Current Paths array
        const currentPathsArray = paths.startsWith('$') ? (paths === '$' ? prevPaths : []) : [...prevPaths, paths];

        // Current Paths
        const currentPathsString = currentPathsArray.join('.');

        // The value corresponding to the current Paths
        const currentPathsValue = cSchema.path(currentPathsString);

        if (!paths.startsWith('$'))
          if (currentPathsValue === undefined) {
            const currentModel = getModel(prevPathsValue);
            if (currentModel) {
              const subConditions = await lookup([], value, currentModel.schema);

              if (subConditions) {
                const ids = (await currentModel.find(flatten({ [paths]: subConditions }), '_id')).map((v) =>
                  v._id.toString()
                );

                return { $in: ids };
              }
            }
          }

        if (Array.isArray(value))
          Object.assign(result, {
            [paths]: await Promise.all(value.map(async (v) => await lookup(currentPathsArray, v, cSchema))),
          });
        else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0 && !isValidObjectId(value))
          Object.assign(result, {
            [paths]: Object.fromEntries(
              await Promise.all(
                Object.entries(value).map(
                  async ([k, v]) =>
                    Object.entries(
                      await lookup(
                        currentPathsArray,
                        {
                          [k]: v,
                        },
                        cSchema
                      )
                    )[0]
                )
              )
            ),
          });
        else result[paths] = value;
      }
      return result;
    }
    const newFilter = await lookup([], filter);
    return this.paginate(newFilter, options);
  };
}

module.exports = paginateByReference;
