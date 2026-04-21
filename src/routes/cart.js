const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/requireRole');
const { ROLES } = require('../constants/roles');

router.use(authenticate);
router.use(requireRole(ROLES.CUSTOMER));

router.post('/', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
