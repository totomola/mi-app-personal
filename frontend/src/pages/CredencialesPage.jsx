import { useState, useEffect } from 'react';
import api from '../api/client';

function CredencialesPage() {
  const [credenciales, setCredenciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordId, setShowPasswordId] = useState(null);

  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  async function fetchData() {
    const response = await api.get('/credenciales');
    setCredenciales(response.data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await api.post('/credenciales', { siteName, siteUrl, username, password, notes });

    setSiteName('');
    setSiteUrl('');
    setUsername('');
    setPassword('');
    setNotes('');

    fetchData();
  }

  async function handleDelete(id) {
    await api.delete(`/credenciales/${id}`);
    fetchData();
  }

  if (loading) {
    return <p className="text-white">Cargando...</p>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Contraseñas</h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Sitio</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="bg-slate-700 p-2 rounded" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">URL</label>
          <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="bg-slate-700 p-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Usuario</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-700 p-2 rounded" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-700 p-2 rounded" required />
        </div>
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm text-slate-400 mb-1">Notas</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-slate-700 p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold px-4">
          Guardar
        </button>
      </form>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="pb-2">Sitio</th>
            <th className="pb-2">Usuario</th>
            <th className="pb-2">Contraseña</th>
            <th className="pb-2">Notas</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {credenciales.map((c) => (
            <tr key={c.id} className="border-b border-slate-800">
              <td className="py-2">
                {c.siteUrl ? (
                  <a href={c.siteUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                    {c.siteName}
                  </a>
                ) : (
                  c.siteName
                )}
              </td>
              <td className="py-2">{c.username}</td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <span>{showPasswordId === c.id ? c.password : '••••••••'}</span>
                  <button
                    onClick={() => setShowPasswordId(showPasswordId === c.id ? null : c.id)}
                    className="text-xs text-blue-400 underline"
                  >
                    {showPasswordId === c.id ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </td>
              <td className="py-2">{c.notes}</td>
              <td className="py-2">
                <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 text-sm">
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CredencialesPage;