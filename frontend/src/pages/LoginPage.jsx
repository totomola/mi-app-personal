import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch
    {
      setError('Email o contraseña incorrectos');
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Iniciar sesión</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;