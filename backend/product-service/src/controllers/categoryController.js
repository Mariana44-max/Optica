const categoryService = require('../services/categoryService');
const { validateCategory } = require('../dtos/productDtos');

class CategoryController {
  async list(req, res) {
    try {
      const data = await categoryService.list();
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const errors = validateCategory(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const created = await categoryService.create(req.body.name);
      res.status(201).json(created);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new CategoryController();
