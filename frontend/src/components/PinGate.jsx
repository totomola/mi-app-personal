import { useState } from 'react';
import { usePin } from '../context/PinContext';
import api from '../api/client';

function PinGate({ children }) {
  const { unlocked, unlock } = usePin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/pin/verify', { pin });
      unlock();
    } catch {
      setError('PIN incorrecto');
    }
  }

  if (unlocked) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg w-72 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white">Ingresá tu PIN</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white outline-none text-center text-2xl tracking-widest"
          maxLength={6}
          autoFocus
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold">
          Desbloquear
        </button>
      </form>
    </div>
  );
}

export default PinGate;