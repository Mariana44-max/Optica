const Category = require('../models/Category');

class CategoryRepository {
  findAll() {
    return Category.findAll({ order: [['name', 'ASC']] });
  }

  findById(id) {
    return Category.findByPk(id);
  }

  findByName(name) {
    return Category.findOne({ where: { name } });
  }

  create(name) {
    return Category.create({ name });
  }

  async ensureDefaults() {
    const defaults = ['Lentes formulados', 'Gafas de sol', 'Monturas', 'Lentes de contacto'];
    for (const name of defaults) {
      const found = await this.findByName(name);
      if (!found) await this.create(name);
    }
  }
}

module.exports = new CategoryRepository();
