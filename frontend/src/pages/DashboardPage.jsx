import { useEffect } from 'react';
import { usePin } from '../context/PinContext';

function DashboardPage() {
  const { lock } = usePin();

  useEffect(() => {
    lock();
  }, []);

  return <h1 className="text-3xl font-bold text-white p-8">Dashboard</h1>;
}

export default DashboardPage;