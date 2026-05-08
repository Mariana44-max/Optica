const productService = require('../services/productService');
const { validateProduct } = require('../dtos/productDtos');

class ProductController {
  async list(req, res) {
    try {
      const { category_id } = req.query;
      const data = category_id
        ? await productService.listByCategory(category_id)
        : await productService.list();
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await productService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const errors = validateProduct(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const created = await productService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const errors = validateProduct(req.body, true);
      if (errors.length) return res.status(400).json({ errors });
      const updated = await productService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      const result = await productService.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
