const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductRepository {
  findAll() {
    return Product.findAll({ include: [{ model: Category, as: 'category' }], order: [['id', 'DESC']] });
  }

  findById(id) {
    return Product.findByPk(id, { include: [{ model: Category, as: 'category' }] });
  }

  findByCategory(categoryId) {
    return Product.findAll({
      where: { category_id: categoryId },
      include: [{ model: Category, as: 'category' }],
      order: [['id', 'DESC']],
    });
  }

  create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.update(data);
    return this.findById(id);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    await product.destroy();
    return true;
  }
}

module.exports = new ProductRepository();
