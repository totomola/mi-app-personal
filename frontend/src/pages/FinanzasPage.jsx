import { useState, useEffect } from 'react';
import api from '../api/client';

const GASTO_CATEGORIAS = [
  'COMIDA',
  'COMBUSTIBLE',
  'ALQUILER',
  'SUPERMERCADO',
  'OCIO',
  'GASTOS_SEGUNDO',
  'PSICOLOGA',
  'MUTUAL',
  'EDUCACION',
  'OTRO',
  'VACACIONES',
  'CARRERAS',
];

const INGRESO_CATEGORIAS = [
  'SUELDO_NETO',
  'BONO_CATEGORIA',
  'COMISION_VENTAS',
  'PREMIOS',
  'GUARDIAS',
  'INGRESO_EXTRA',
  'EMPRENDIMIENTO',
  'OTRO_INGRESO',
];

function FinanzasPage() {
  const [transactions, setTransactions] = useState([]);
  const [resumen, setResumen] = useState({});
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState('GASTO');
  const [category, setCategory] = useState(GASTO_CATEGORIAS[0]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [description, setDescription] = useState('');

  const categoriasDisponibles = type === 'GASTO' ? GASTO_CATEGORIAS : INGRESO_CATEGORIAS;

  function handleTypeChange(nuevoTipo) {
    setType(nuevoTipo);
    const nuevaLista = nuevoTipo === 'GASTO' ? GASTO_CATEGORIAS : INGRESO_CATEGORIAS;
    setCategory(nuevaLista[0]);
  }

  async function fetchData() {
    const [transaccionesRes, resumenRes] = await Promise.all([
      api.get('/finanzas'),
      api.get('/finanzas/resumen'),
    ]);
    setTransactions(transaccionesRes.data);
    setResumen(resumenRes.data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await api.post('/finanzas', {
      type,
      category,
      amount: Number(amount),
      currency,
      description,
    });

    setAmount('');
    setDescription('');

    fetchData();
  }

  if (loading) {
    return <p className="text-white">Cargando...</p>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Finanzas</h1>

      <div className="flex gap-4 mb-8">
        {Object.entries(resumen).map(([moneda, datos]) => (
          <div key={moneda} className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">{moneda}</p>
            <p className={`text-2xl font-bold ${datos.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {datos.balance}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Tipo</label>
          <select value={type} onChange={(e) => handleTypeChange(e.target.value)} className="bg-slate-700 p-2 rounded">
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-700 p-2 rounded">
            {categoriasDisponibles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Monto</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-700 p-2 rounded w-28"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400 mb-1">Moneda</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-700 p-2 rounded">
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm text-slate-400 mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-700 p-2 rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold px-4">
          Agregar
        </button>
      </form>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="pb-2">Fecha</th>
            <th className="pb-2">Categoría</th>
            <th className="pb-2">Descripción</th>
            <th className="pb-2">Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-slate-800">
              <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="py-2">{t.category}</td>
              <td className="py-2">{t.description}</td>
              <td className={`py-2 ${t.type === 'INGRESO' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'INGRESO' ? '+' : '-'}{t.amount} {t.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinanzasPage;