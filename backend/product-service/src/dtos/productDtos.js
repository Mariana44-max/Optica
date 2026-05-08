function toProductResponseDTO(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
  };
}

function validateProduct(body, partial = false) {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (!body.name || body.name.trim().length < 2) errors.push('name requerido');
  }
  if (!partial || body.price !== undefined) {
    if (body.price === undefined || isNaN(Number(body.price)) || Number(body.price) < 0)
      errors.push('price invalido');
  }
  if (!partial || body.stock !== undefined) {
    if (body.stock === undefined || !Number.isInteger(Number(body.stock)) || Number(body.stock) < 0)
      errors.push('stock invalido');
  }
  if (!partial || body.category_id !== undefined) {
    if (!body.category_id) errors.push('category_id requerido');
  }
  return errors;
}

function validateCategory(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) errors.push('name de categoria requerido');
  return errors;
}

module.exports = { toProductResponseDTO, validateProduct, validateCategory };
