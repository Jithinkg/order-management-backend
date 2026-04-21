const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redis = require('../config/redis');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    throw new AppError('Token is no longer valid. Please login again', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  req.user = user;
  next();
});

module.exports = authenticate;
