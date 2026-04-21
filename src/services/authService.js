const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const redis = require('../config/redis');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const user = await User.create({ name, email, password, role });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  user.password = undefined;

  return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  user.password = undefined;

  return { user, accessToken, refreshToken };
};

const refresh = async (token) => {
  if (!token) {
    throw new AppError('No refresh token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  const accessToken = generateAccessToken(user._id);

  return { accessToken };
};

const logout = async (userId, accessToken) => {
  const decoded = jwt.decode(accessToken);

  const expiresAt = decoded.exp;
  const now = Math.floor(Date.now() / 1000);
  const ttl = expiresAt - now;

  if (ttl > 0) {
    await redis.set(`blacklist:${accessToken}`, '1', 'EX', ttl);
  }

  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = { register, login, refresh, logout };
