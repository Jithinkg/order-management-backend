const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  };
};

module.exports = requireRole;
