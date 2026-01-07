import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function PublicNavbar() {
  const navigate = useNavigate();

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
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
