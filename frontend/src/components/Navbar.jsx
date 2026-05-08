import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <h1>Optica - Gestion de Productos</h1>
      <div className="links">
        {user && user.role === 'ADMIN' && (
          <>
            <Link to="/admin">Productos (Admin)</Link>
            <Link to="/admin/new">Crear producto</Link>
          </>
        )}
        {user && user.role === 'USER' && <Link to="/catalog">Catalogo</Link>}
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout}>Cerrar sesion</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}
