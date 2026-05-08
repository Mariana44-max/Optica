const express = require('express');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/categories', authenticate, (req, res) => categoryController.list(req, res));
router.post('/categories', authenticate, authorize('ADMIN'), (req, res) =>
  categoryController.create(req, res)
);

router.get('/products', authenticate, (req, res) => productController.list(req, res));
router.get('/products/:id', authenticate, (req, res) => productController.getById(req, res));
router.post('/products', authenticate, authorize('ADMIN'), (req, res) =>
  productController.create(req, res)
);
router.put('/products/:id', authenticate, authorize('ADMIN'), (req, res) =>
  productController.update(req, res)
);
router.delete('/products/:id', authenticate, authorize('ADMIN'), (req, res) =>
  productController.remove(req, res)
);

module.exports = router;
