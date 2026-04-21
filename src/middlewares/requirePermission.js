const AppError = require('../utils/AppError');
const { ROLE_PERMISSIONS } = require('../constants/roles');

const requirePermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = ROLE_PERMISSIONS[req.user.role];

    if (!userPermissions.includes(permission)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    next();
  };
};

module.exports = requirePermission;
