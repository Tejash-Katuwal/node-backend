
    const httpStatus = require("http-status");
    const OperationLog = require("../models/operationLog.model");
    const ApiError = require("../utils/ApiError");
    
    /**
     * Query for operationLog
     * @param {Object} filter - Mongo filter
     * @param {Object} options - Query options
     * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    const getOperationLogs = async (filter, options) => {
      const operationLog = await OperationLog.paginate(filter, options);
      return operationLog;
    };
    
    /**
     * Create a OperationLog
     * @param {Object} operationLogBody
     * @returns {Promise<OperationLog>}
     */
    const createOperationLog = async (operationLogBody) => {
      const createdOperationLog = await OperationLog.create(operationLogBody);
    
      return createdOperationLog;
    };
    
    /**
     * Get OperationLog by id
     * @param {ObjectId} id
     * @returns {Promise<OperationLog>}
     */
    const getOperationLogById = async (id) => {
      return OperationLog.findById(id);
    };
    
    /**
     * Update OperationLog by id
     * @param {ObjectId} OperationLogId
     * @param {Object} updateBody
     * @returns {Promise<OperationLog>}
     */
    const updateOperationLogById = async (operationLogId, updateBody) => {
      const operationLog = await getOperationLogById(operationLogId);
      if (!operationLog) {
        throw new ApiError(httpStatus.NOT_FOUND, "OperationLog फेला परेन");
      }
    
      Object.assign(operationLog, updateBody);
      await operationLog.save();
      return operationLog;
    };
    
    /**
     * Delete operationLog by id
     * @param {ObjectId} operationLogId
     * @returns {Promise<ANM>}
     */
    const deleteOperationLogById = async (operationLogId) => {
      const operationLog = await getOperationLogById(operationLogId);
      if (!operationLog) {
        throw new ApiError(httpStatus.NOT_FOUND, "OperationLog फेला परेन");
      }
      await operationLog.remove();
      return operationLog;
    };
    
    module.exports = {
      getOperationLogs,
      createOperationLog,
      getOperationLogById,
      updateOperationLogById,
      deleteOperationLogById,
    };
    