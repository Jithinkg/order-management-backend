const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/requireRole');
const { ROLES } = require('../constants/roles');
const { createOrderRules, handleValidation } = require('../middlewares/validate');

router.use(authenticate);

router.post('/', requireRole(ROLES.CUSTOMER), createOrderRules, handleValidation, orderController.createOrder);
router.get('/', requireRole(ROLES.CUSTOMER), orderController.getMyOrders);
router.get('/:id', requireRole(ROLES.CUSTOMER), orderController.getOrderById);
router.put('/:id/cancel', requireRole(ROLES.CUSTOMER), orderController.cancelOrder);

router.put('/:id/status', requireRole(ROLES.RESTAURANT_OWNER), orderController.updateOrderStatus);

module.exports = router;
