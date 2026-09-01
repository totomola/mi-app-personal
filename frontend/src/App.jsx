import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FinanzasPage from './pages/FinanzasPage';
import CredencialesPage from './pages/CredencialesPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PinGate from './components/PinGate';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/finanzas" element={<FinanzasPage />} />
        <Route
  path="/credenciales"
  element={
    <PinGate>
      <CredencialesPage />
    </PinGate>
  }
/>
      </Route>
    </Routes>
  );
}

export default App;