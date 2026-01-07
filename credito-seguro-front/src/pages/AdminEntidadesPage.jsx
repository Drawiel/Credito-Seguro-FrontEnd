import { useEffect, useMemo, useState } from "react";
import { axiosPrivate } from "@/api/axios";

export default function AdminEntidadesPage() {
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [activo, setActivo] = useState("todos"); 
  const [tipoEntidad, setTipoEntidad] = useState("todos");

  const cargarEntidades = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (activo !== "todos") params.activo = activo;
      if (tipoEntidad !== "todos") params.tipoEntidad = tipoEntidad;

      const res = await axiosPrivate.get("/entidades", { params });
      const data = res.data?.datos ?? res.data;
      setEntidades(data?.entidades ?? []);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudieron cargar las entidades.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEntidades();
  }, [activo, tipoEntidad]);

  const entidadesFiltradas = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return entidades;

    return entidades.filter((e) => {
      const nombre = (e.nombreLegal || "").toLowerCase();
      const rfc = (e.rfc || "").toLowerCase();
      return nombre.includes(term) || rfc.includes(term);
    });
  }, [entidades, q]);

  const cambiarEstado = async (entidad) => {
    setError("");
    const accion = entidad.activo ? "desactivar" : "reactivar";

    const ok = window.confirm(
      entidad.activo
        ? `¿Seguro que deseas DESACTIVAR la entidad "${entidad.nombreLegal}"?`
        : `¿Seguro que deseas REACTIVAR la entidad "${entidad.nombreLegal}"?`
    );
    if (!ok) return;

    try {
      setWorkingId(entidad.id);
      await axiosPrivate.patch(`/entidades/${accion}`, { id: entidad.id });
      await cargarEntidades();
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.mensaje ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo actualizar el estado de la entidad.";
      setError(msg);
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestionar entidades financieras
        </h1>
        <p className="text-slate-600">Alta, baja y consulta de entidades.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        {/* filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Buscar (RFC o nombre)
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2"
              placeholder="Ej. TEC150823KL5 o Tech Solutions"
            />
            <p className="mt-1 text-xs text-slate-500">
              Filtrado local con la lista cargada (no usa endpoint /buscar).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Estatus
            </label>
            <select
              value={activo}
              onChange={(e) => setActivo(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 bg-white"
            >
              <option value="todos">Todos</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tipo entidad
            </label>
            <select
              value={tipoEntidad}
              onChange={(e) => setTipoEntidad(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 bg-white"
            >
              <option value="todos">Todos</option>
              <option value="FISICA">Física</option>
              <option value="MORAL">Moral</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={cargarEntidades}
            disabled={loading}
            className="px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>

          <div className="text-sm text-slate-600">
            {entidadesFiltradas.length} entidad(es) mostradas
          </div>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        {/* tabla */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">ID</th>
                <th className="text-left px-3 py-2 font-semibold">Nombre legal</th>
                <th className="text-left px-3 py-2 font-semibold">RFC</th>
                <th className="text-left px-3 py-2 font-semibold">Tipo</th>
                <th className="text-left px-3 py-2 font-semibold">Estatus</th>
                <th className="text-left px-3 py-2 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-600" colSpan={6}>
                    Cargando entidades...
                  </td>
                </tr>
              ) : entidadesFiltradas.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-600" colSpan={6}>
                    No hay entidades para mostrar.
                  </td>
                </tr>
              ) : (
                entidadesFiltradas.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{e.id}</td>
                    <td className="px-3 py-2 text-slate-900 font-medium">
                      {e.nombreLegal}
                    </td>
                    <td className="px-3 py-2 text-slate-700">{e.rfc}</td>
                    <td className="px-3 py-2 text-slate-700">{e.tipoEntidad}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          e.activo
                            ? "inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200"
                            : "inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 border border-red-200"
                        }
                      >
                        {e.activo ? "ACTIVA" : "INACTIVA"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => cambiarEstado(e)}
                        disabled={workingId === e.id}
                        className={
                          e.activo
                            ? "px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60"
                            : "px-3 py-1.5 rounded-md border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-60"
                        }
                      >
                        {workingId === e.id
                          ? "Procesando..."
                          : e.activo
                          ? "Desactivar"
                          : "Reactivar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
