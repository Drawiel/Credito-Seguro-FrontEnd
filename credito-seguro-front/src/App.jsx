import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Un componente simple para el Dashboard (solo para probar que el login funcionó)
const Dashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>¡Bienvenido al Panel!</h1>
      <p>Has iniciado sesión correctamente.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta protegida (Dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirección por defecto: si entran a la raíz, van al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;