const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
  async list() {
    return categoryRepository.findAll();
  }

  async create(name) {
    const exists = await categoryRepository.findByName(name);
    if (exists) {
      const err = new Error('La categoria ya existe');
      err.status = 409;
      throw err;
    }
    return categoryRepository.create(name);
  }
}

module.exports = new CategoryService();
