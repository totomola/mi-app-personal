import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex gap-6">
        <Link to="/" className="text-white font-semibold hover:text-blue-400">
          Dashboard
        </Link>
        <Link to="/finanzas" className="text-white font-semibold hover:text-blue-400">
          Finanzas
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}

export default Navbar;