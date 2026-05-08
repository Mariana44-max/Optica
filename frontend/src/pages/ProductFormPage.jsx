import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  getProduct,
  listCategories,
  updateProduct,
} from '../api/productApi';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listCategories().then(setCategories);
    if (isEdit) {
      getProduct(id).then((p) =>
        setForm({
          name: p.name,
          description: p.description || '',
          price: p.price,
          stock: p.stock,
          category_id: p.category?.id || '',
        })
      );
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      };
      if (isEdit) await updateProduct(id, payload);
      else await createProduct(payload);
      navigate('/admin');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || data?.errors?.join(', ') || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>{isEdit ? 'Editar producto' : 'Crear producto'}</h2>
      {error && <div className="error">{error}</div>}
      <form className="card" onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label>Descripcion</label>
        <textarea
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="row">
          <div className="col">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="col">
            <label>Stock</label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>
        <label>Categoria</label>
        <select
          required
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Selecciona una categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn btn-primary" disabled={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate('/admin')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
