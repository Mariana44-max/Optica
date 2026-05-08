import { useEffect, useState } from 'react';
import { listCategories, listProducts } from '../api/productApi';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setError('');
    listProducts(filter || undefined)
      .then(setProducts)
      .catch((e) => setError(e.response?.data?.error || e.message));
  }, [filter]);

  return (
    <div className="container">
      <h2>Catalogo de productos</h2>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <label>Filtrar por categoria</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todas las categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {products.length === 0 && <p>No hay productos disponibles.</p>}
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>
              <span className="badge">{p.category?.name}</span>
            </p>
            <p className="product-price">${p.price.toFixed(2)}</p>
            <p>Stock: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
