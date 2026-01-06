import { useState } from "react";
import { Search } from "lucide-react";

export default function BancoConsultaTercerosPage() {
  const [query, setQuery] = useState(""); // RFC o Folio o lo que uses
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    if (!query.trim()) {
      setError("Escribe un RFC o identificador para buscar.");
      return;
    }

    try {
      setLoading(true);

      // Aquí irá tu llamada real cuando tengas endpoint:
      // const res = await axiosPrivate.get(`/historial-crediticio/terceros?query=${encodeURIComponent(query)}`);
      // setResultado(res.data);

      // Placeholder:
      setResultado({
        mensaje: "Resultado de ejemplo (aquí se mostrará el historial del tercero).",
        buscado: query
      });
    } catch (err) {
      setError("No se pudo consultar el historial. Verifica permisos/consentimiento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Consulta de terceros</h1>
        <p className="text-slate-600">
          Consulta el historial crediticio de un tercero (requiere consentimiento).
        </p>
      </header>

      {/* Barra de búsqueda */}
      <form onSubmit={handleBuscar} className="bg-white border border-slate-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Buscar por RFC / ID / Folio
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. ABCD010203XXX"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </form>

      {/* Resultado */}
      <div className="mt-6">
        {!resultado ? (
          <div className="text-slate-500 text-sm">
            Ingresa un dato de búsqueda y presiona “Buscar”.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-2">
              Búsqueda: <span className="font-medium text-slate-900">{resultado.buscado}</span>
            </div>
            <div className="text-slate-900">
              {resultado.mensaje}
            </div>

            {/* Aquí después renderizas tabla del historial */}
          </div>
        )}
      </div>
    </div>
  );
}
