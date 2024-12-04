
    const httpStatus = require("http-status");
    const OrganizationType = require("../models/organizationType.model");
    const ApiError = require("../utils/ApiError");
    
    /**
     * Query for organizationType
     * @param {Object} filter - Mongo filter
     * @param {Object} options - Query options
     * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    const getOrganizationTypes = async (filter, options) => {
      const organizationType = await OrganizationType.paginate(filter, options);
      return organizationType;
    };
    
    /**
     * Create a OrganizationType
     * @param {Object} organizationTypeBody
     * @returns {Promise<OrganizationType>}
     */
    const createOrganizationType = async (organizationTypeBody) => {
      const createdOrganizationType = await OrganizationType.create(organizationTypeBody);
    
      return createdOrganizationType;
    };
    
    /**
     * Get OrganizationType by id
     * @param {ObjectId} id
     * @returns {Promise<OrganizationType>}
     */
    const getOrganizationTypeById = async (id) => {
      return OrganizationType.findById(id);
    };
    
    /**
     * Update OrganizationType by id
     * @param {ObjectId} OrganizationTypeId
     * @param {Object} updateBody
     * @returns {Promise<OrganizationType>}
     */
    const updateOrganizationTypeById = async (organizationTypeId, updateBody) => {
      const organizationType = await getOrganizationTypeById(organizationTypeId);
      if (!organizationType) {
        throw new ApiError(httpStatus.NOT_FOUND, "OrganizationType फेला परेन");
      }
    
      Object.assign(organizationType, updateBody);
      await organizationType.save();
      return organizationType;
    };
    
    /**
     * Delete organizationType by id
     * @param {ObjectId} organizationTypeId
     * @returns {Promise<ANM>}
     */
    const deleteOrganizationTypeById = async (organizationTypeId) => {
      const organizationType = await getOrganizationTypeById(organizationTypeId);
      if (!organizationType) {
        throw new ApiError(httpStatus.NOT_FOUND, "OrganizationType फेला परेन");
      }
      await organizationType.remove();
      return organizationType;
    };
    
    module.exports = {
      getOrganizationTypes,
      createOrganizationType,
      getOrganizationTypeById,
      updateOrganizationTypeById,
      deleteOrganizationTypeById,
    };
    