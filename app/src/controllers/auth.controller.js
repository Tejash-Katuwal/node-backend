const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(username, password);

  user.id = user._id.toString();
  const userBody = user.toJSON();
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ data: { ...userBody, ...tokens } });
});

const loginStudent = catchAsync(async (req, res) => {
  const { phone, date_of_birth } = req.body;
  const users = await authService.loginUserWithPhoneAndDOB(phone);
  const authUsers = [];

  const index = users.findIndex(
    (user) => user.date_of_birth_bs === date_of_birth || user.date_of_birth_ad === date_of_birth
  );

  if (index === -1) throw new ApiError(httpStatus.UNAUTHORIZED, 'student भेटिएन । ');

  for (let index = 0; index < users.length; index++) {
    const user = users[index].toJSON();
    const tokens = await tokenService.generateAuthTokens(user);
    authUsers.push({ ...user, ...tokens });
  }

  res.send({ data: authUsers });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginStudent,
};
