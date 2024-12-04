
    const httpStatus = require("http-status");
    const Organization = require("../models/organization.model");
    const ApiError = require("../utils/ApiError");
    
    /**
     * Query for organization
     * @param {Object} filter - Mongo filter
     * @param {Object} options - Query options
     * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    const getOrganizations = async (filter, options) => {
      const organization = await Organization.paginate(filter, options);
      return organization;
    };
    
    /**
     * Create a Organization
     * @param {Object} organizationBody
     * @returns {Promise<Organization>}
     */
    const createOrganization = async (organizationBody) => {
      const createdOrganization = await Organization.create(organizationBody);
    
      return createdOrganization;
    };
    
    /**
     * Get Organization by id
     * @param {ObjectId} id
     * @returns {Promise<Organization>}
     */
    const getOrganizationById = async (id) => {
      return Organization.findById(id);
    };
    
    /**
     * Update Organization by id
     * @param {ObjectId} OrganizationId
     * @param {Object} updateBody
     * @returns {Promise<Organization>}
     */
    const updateOrganizationById = async (organizationId, updateBody) => {
      const organization = await getOrganizationById(organizationId);
      if (!organization) {
        throw new ApiError(httpStatus.NOT_FOUND, "Organization फेला परेन");
      }
    
      Object.assign(organization, updateBody);
      await organization.save();
      return organization;
    };
    
    /**
     * Delete organization by id
     * @param {ObjectId} organizationId
     * @returns {Promise<ANM>}
     */
    const deleteOrganizationById = async (organizationId) => {
      const organization = await getOrganizationById(organizationId);
      if (!organization) {
        throw new ApiError(httpStatus.NOT_FOUND, "Organization फेला परेन");
      }
      await organization.remove();
      return organization;
    };
    
    module.exports = {
      getOrganizations,
      createOrganization,
      getOrganizationById,
      updateOrganizationById,
      deleteOrganizationById,
    };
    