const httpStatus = require('http-status');
const Employee = require('../models/employee.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for employee
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getEmployees = async (filter, options) => {
  const employee = await Employee.paginate(filter, options);
  return employee;
};

/**
 * Create a Employee
 * @param {Object} employeeBody
 * @returns {Promise<Employee>}
 */
const createEmployee = async (employeeBody) => {
  const createdEmployee = await Employee(employeeBody);

  return createdEmployee;
};

/**
 * Get Employee by id
 * @param {ObjectId} id
 * @returns {Promise<Employee>}
 */
const getEmployeeById = async (id, organization, populate) => {
  if (populate) {
    if (organization) {
      return Employee.findOne({ _id: id, organization }).populate(populate);
    }
    return Employee.findById(id).populate(populate);
  } else if (organization) {
    return Employee.findOne({ _id: id, organization });
  }
  return Employee.findById(id);
};

/**
 * Update Employee by id
 * @param {ObjectId} EmployeeId
 * @param {Object} updateBody
 * @returns {Promise<Employee>}
 */
const updateEmployeeById = async (employeeId, updateBody, organization) => {
  const employee = await getEmployeeById(employeeId, organization);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee फेला परेन');
  }

  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Delete employee by id
 * @param {ObjectId} employeeId
 * @returns {Promise<ANM>}
 */
const deleteEmployeeById = async (employeeId, organization) => {
  const employee = await getEmployeeById(employeeId, organization);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee फेला परेन');
  }
  await employee.remove();
  return employee;
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
