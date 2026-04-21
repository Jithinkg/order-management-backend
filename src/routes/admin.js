const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/requireRole');
const { ROLES } = require('../constants/roles');

router.use(authenticate);
router.use(requireRole(ROLES.SUPER_ADMIN));

router.get('/orders', adminController.getAllOrders);
router.get('/users', adminController.getAllUsers);
router.get('/orders/stats', adminController.getOrderStats);

module.exports = router;
