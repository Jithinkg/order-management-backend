const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendSuccess');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const { user, accessToken, refreshToken } = await authService.register({
    name,
    email,
    password,
    role,
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, { user, accessToken }, 'Registered successfully', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  sendSuccess(res, { user, accessToken }, 'Logged in successfully');
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const { accessToken } = await authService.refresh(token);

  sendSuccess(res, { accessToken }, 'Token refreshed successfully');
});

const logout = asyncHandler(async (req, res) => {
  const accessToken = req.headers['authorization'].split(' ')[1];

  await authService.logout(req.user._id, accessToken);

  res.clearCookie('refreshToken', COOKIE_OPTIONS);

  sendSuccess(res, null, 'Logged out successfully');
});

module.exports = { register, login, refresh, logout };
