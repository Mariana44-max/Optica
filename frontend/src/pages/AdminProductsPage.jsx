import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts, deleteProduct, listCategories } from '../api/productApi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  function load() {
    listProducts(filter || undefined)
      .then(setProducts)
      .catch((e) => setError(e.response?.data?.error || e.message));
  }

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [filter]);

  async function handleDelete(id) {
    if (!confirm('Eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Administracion de productos</h2>
        <Link to="/admin/new" className="btn btn-success" style={{ textDecoration: 'none' }}>
          + Nuevo producto
        </Link>
      </div>
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

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <Link
                    to={`/admin/edit/${p.id}`}
                    className="btn btn-warning"
                    style={{ textDecoration: 'none', marginRight: 8 }}
                  >
                    Editar
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Sin productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
