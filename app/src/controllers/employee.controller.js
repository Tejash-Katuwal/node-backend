const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const employeeService = require('../services/employee.service');
const userService = require('../services/user.service');
const { deviceQueue } = require('../services/schedule.service');
const { userCreateUpdateCommand, userDeleteCommand } = require('../services/command.service');

const getEmployees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'department', 'organization']);

  if (filter.name) {
    filter.name = { $regex: filter.name, $options: '' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'noPagination']);
  options.populate = [{ path: 'shift', select: 'title' }];
  const result = await employeeService.getEmployees(filter, options);
  res.send({ data: result, message: 'employee lists' });
});

const createEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee({
    ...req.body,
    createdBy: req.user.id,
  });
  const newEmployee = await new Promise((resolve, reject) => {
    employee.setNext('userId', (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
  await deviceQueue.add(newEmployee.department, userCreateUpdateCommand(newEmployee));

  res.status(httpStatus.CREATED).send({ data: employee, message: 'employee created' });
});

const verifyEmployee = catchAsync(async (req, res) => {
  const employee = await userService.updateUserByIdDiscreminator(
    [
      {
        id: req.params.id,
        ...req.body,
        userType: 'Employee',
        status: 'active',
        createdBy: req.user.id,
      },
    ],
    false,
    req.query.organization
  );
  if (employee.length) {
    const newEmployee = employee.pop();
    await deviceQueue.add(employee.department, userCreateUpdateCommand(newEmployee));

    res.status(httpStatus.CREATED).send({ data: newEmployee, message: 'employee created' });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'employee फेला परेन');
  }
});

const getEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id, req.query.organization);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employee फेला परेन');
  }
  res.send({ data: employee, message: 'employee detail' });
});

const updateEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.updateEmployeeById(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    req.query.organization
  );
  await deviceQueue.add(employee.department, userCreateUpdateCommand(employee));

  res.send({ data: employee, message: 'employee updated' });
});

const deleteEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.deleteEmployeeById(req.params.id, req.query.organization);
  await deviceQueue.add(employee.department, userDeleteCommand(employee));
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  verifyEmployee,
};
