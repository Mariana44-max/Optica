import { productApi } from './client';

export const listProducts = (categoryId) => {
  const params = categoryId ? { category_id: categoryId } : {};
  return productApi.get('/api/products', { params }).then((r) => r.data);
};
export const getProduct = (id) => productApi.get(`/api/products/${id}`).then((r) => r.data);
export const createProduct = (data) => productApi.post('/api/products', data).then((r) => r.data);
export const updateProduct = (id, data) =>
  productApi.put(`/api/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => productApi.delete(`/api/products/${id}`).then((r) => r.data);
export const listCategories = () => productApi.get('/api/categories').then((r) => r.data);
