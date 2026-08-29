import { useState, useEffect } from 'react';
import api from '../api/client';

function FinanzasPage() {
  const [transactions, setTransactions] = useState([]);
  const [resumen, setResumen] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [transaccionesRes, resumenRes] = await Promise.all([
        api.get('/finanzas'),
        api.get('/finanzas/resumen'),
      ]);
      setTransactions(transaccionesRes.data);
      setResumen(resumenRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

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