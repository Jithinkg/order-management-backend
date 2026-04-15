const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.register({
    name,
    email,
    password,
  });

  sendSuccess(res, { user, token }, 'Registered successfully', 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  sendSuccess(res, { user, token }, 'Logged in successfully');
});

module.exports = { register, login };
