const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
const { toProductResponseDTO } = require('../dtos/productDtos');

class ProductService {
  async list() {
    const products = await productRepository.findAll();
    return products.map(toProductResponseDTO);
  }

  async listByCategory(categoryId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      const err = new Error('Categoria no existe');
      err.status = 404;
      throw err;
    }
    const products = await productRepository.findByCategory(categoryId);
    return products.map(toProductResponseDTO);
  }

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    return toProductResponseDTO(product);
  }

  async create(data) {
    const category = await categoryRepository.findById(data.category_id);
    if (!category) {
      const err = new Error('La categoria no existe');
      err.status = 400;
      throw err;
    }
    const created = await productRepository.create(data);
    const full = await productRepository.findById(created.id);
    return toProductResponseDTO(full);
  }

  async update(id, data) {
    if (data.category_id) {
      const category = await categoryRepository.findById(data.category_id);
      if (!category) {
        const err = new Error('La categoria no existe');
        err.status = 400;
        throw err;
      }
    }
    const updated = await productRepository.update(id, data);
    if (!updated) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    return toProductResponseDTO(updated);
  }

  async remove(id) {
    const ok = await productRepository.delete(id);
    if (!ok) {
      const err = new Error('Producto no encontrado');
      err.status = 404;
      throw err;
    }
    return { deleted: true };
  }
}

module.exports = new ProductService();
