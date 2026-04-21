const express = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../constants/roles');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', authenticate, requirePermission(PERMISSIONS.CREATE_PRODUCT), productController.createProduct);
router.put('/:id', authenticate, requirePermission(PERMISSIONS.EDIT_PRODUCT), productController.updateProduct);
router.delete('/:id', authenticate, requirePermission(PERMISSIONS.DELETE_PRODUCT), productController.deleteProduct);

module.exports = router;
