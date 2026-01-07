import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

const linkBase = "px-3 py-2 text-sm font-medium transition-colors";
const linkInactive = "text-slate-600 hover:text-slate-900";
const linkActive = "text-blue-600";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Crédito Seguro"
              className="h-9 w-9 object-contain"
            />

            <span
              className="text-xl font-medium tracking-wider text-slate-900"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              CRÉDITO SEGURO
            </span>
          </div>

          {/* Derecha: menú + logout */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <NavLink
                to="/admin/reclamaciones"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Atender reclamaciones
              </NavLink>

              <NavLink
                to="/admin/entidades"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Gestionar entidades financieras
              </NavLink>

            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
              type="button"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
