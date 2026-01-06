import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

export default function BancoNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Crédito Seguro" className="h-9 w-9 object-contain" />
            <span className="text-xl font-medium tracking-wider text-slate-900">
              CRÉDITO SEGURO
            </span>
          </div>

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
    </header>
  );
}
