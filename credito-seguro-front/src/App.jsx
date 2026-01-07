import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RegistroEntidadFinancieraPage from "./pages/RegistroEntidadFinancieraPage";


import RequireAuth from "./components/RequireAuth";

import AdminLayout from "./pages/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminEntidadesPage from "./pages/AdminEntidadesPage";
import AdminAprobarEntidadPage from "./pages/AdminAprobarEntidadPage";

import BancoLayout from "./pages/BancoLayout";
import BancoConsultaTercerosPage from "./pages/BancoConsultaTercerosPage";

import ClienteLayout from "./pages/ClienteLayout";
import ClienteHistorialPage from "./pages/ClienteHistorialPage";
import ClienteScorePage from "./pages/ClienteScorePage";
import ClienteReportePage from "./pages/ClienteReportePage";
import MisReclamacionesPage from "./pages/MisReclamacionesPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAuth allow="ADMIN">
              <AdminLayout />
            </RequireAuth>
          }
       >
          {/* default: /admin -> /admin/reclamaciones */}
          <Route index element={<Navigate to="reclamaciones" replace />} />

          <Route path="reclamaciones" element={<AdminDashboardPage />} />
          <Route path="entidades" element={<AdminEntidadesPage />} />
          <Route path="aprobar-entidad" element={<AdminAprobarEntidadPage />} />
        </Route>

        {/* BANCO */}
        <Route
          path="/banco"
          element={
            <RequireAuth allow="BANCO">
              <BancoLayout  />
            </RequireAuth>
          }
        >
        <Route index element={<BancoConsultaTercerosPage />} />
      </Route>

        {/* CLIENTE */}
        <Route
          path="/cliente"
          element={
            <RequireAuth allow="CLIENTE">
              <ClienteLayout />
            </RequireAuth>
          }
        >
        <Route index element={<Navigate to="historial" replace />} />
        <Route path="historial" element={<ClienteHistorialPage />} />
        <Route path="score" element={<ClienteScorePage />} />
        <Route path="reporte" element={<ClienteReportePage />} />
        <Route path="reclamaciones" element={<MisReclamacionesPage />} />
      </Route>



        {/* Raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Cualquier otra */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      
        <Route path="/registrar-entidad" element={<RegistroEntidadFinancieraPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
