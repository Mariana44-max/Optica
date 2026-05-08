const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authenticate, (req, res) => authController.me(req, res));
router.get('/validate', authenticate, (req, res) => authController.validate(req, res));

module.exports = router;
