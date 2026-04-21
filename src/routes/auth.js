const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { registerRules, loginRules, handleValidation } = require('../middlewares/validate');

const router = express.Router();

router.post('/register', registerRules, handleValidation, authController.register);
router.post('/login', loginRules, handleValidation, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
