import { useState } from "react";
import { Search } from "lucide-react";
import { axiosPrivate } from '../api/axios';

export default function BancoConsultaTercerosPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [entidad, setEntidad] = useState(null);
  const [obligaciones, setObligaciones] = useState([]);
  const [consultasRestantes, setConsultasRestantes] = useState(0);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = async () => {
    setError("");
    setEntidad(null);
    setObligaciones([]);
    setBuscado(false);

    if (!query.trim()) {
      setError("Escribe un RFC para buscar.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/historial-crediticio/${query.trim()}/obligaciones`);
      
      if (response.data.error === false) {
        setEntidad(response.data.datos.entidad);
        setObligaciones(response.data.datos.obligaciones.datos || []);
        setConsultasRestantes(response.data.datos.consultasRestantes);
        setBuscado(true);
      }
    } catch (err) {
      console.error('Error al consultar historial:', err);
      setError(err.response?.data?.mensaje || 'No se pudo consultar el historial. Verifica el RFC o los permisos.');
      setBuscado(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerColorEstatus = (estatus) => {
    const colores = {
      'VIGENTE': 'bg-green-100 text-green-800',
      'VENCIDO': 'bg-red-100 text-red-800',
      'CERRADO': 'bg-gray-100 text-gray-800',
      'LIQUIDADO': 'bg-blue-100 text-blue-800'
    };
    return colores[estatus] || 'bg-gray-100 text-gray-800';
  };

  const obtenerTipoCredito = (tipo) => {
    const tipos = {
      'TARJETA_CREDITO': 'Tarjeta de Crédito',
      'CREDITO_AUTOMOTRIZ': 'Crédito Automotriz',
      'CREDITO_HIPOTECARIO': 'Crédito Hipotecario',
      'CREDITO_PERSONAL': 'Crédito Personal',
      'CREDITO_NOMINA': 'Crédito de Nómina'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Consulta de Terceros</h1>
        <p className="text-slate-600">
          Consulta el historial crediticio de un tercero (requiere consentimiento).
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Buscar por RFC
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Ej. MERL850315HDF"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleBuscar}
            disabled={loading}
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {!buscado ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          <Search size={48} className="mx-auto mb-4 text-slate-400" />
          <p>Ingresa un RFC y presiona "Buscar" para consultar el historial crediticio.</p>
        </div>
      ) : entidad && obligaciones ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Información del Titular</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Nombre: </span>
                <span className="text-blue-900">{entidad.nombreLegal}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">RFC: </span>
                <span className="text-blue-900">{entidad.rfc}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Consultas restantes: </span>
                <span className="text-blue-900 font-bold">{consultasRestantes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {obligaciones.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No se encontraron obligaciones crediticias para este RFC
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Contrato</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Entidad</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Tipo de Crédito</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Monto Original</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Saldo Actual</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Pago Mensual</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-700">Estatus</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-700">Días Atraso</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha Apertura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {obligaciones.map((obligacion) => (
                      <tr key={obligacion.obligacion_id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{obligacion.numero_contrato}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-900">{obligacion.entidad_otorgante}</div>
                          <div className="text-xs text-slate-500">{obligacion.clave_entidad}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {obtenerTipoCredito(obligacion.tipo_credito)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {formatearMoneda(obligacion.monto_original)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-medium text-slate-900">
                            {formatearMoneda(obligacion.saldo_actual)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {obligacion.porcentaje_deuda_original}% deuda
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {formatearMoneda(obligacion.pago_mensual_estimado)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstatus(obligacion.estatus_credito)}`}>
                            {obligacion.estatus_credito}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${obligacion.dias_atraso > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {obligacion.dias_atraso}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatearFecha(obligacion.fecha_apertura)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {obligaciones.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Total Obligaciones</div>
                <div className="text-2xl font-bold text-slate-900">{obligaciones.length}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Deuda Total</div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatearMoneda(obligaciones.reduce((sum, o) => sum + parseFloat(o.saldo_actual), 0))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Pago Mensual Total</div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatearMoneda(obligaciones.reduce((sum, o) => sum + parseFloat(o.pago_mensual_estimado), 0))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Créditos en Atraso</div>
                <div className="text-2xl font-bold text-red-600">
                  {obligaciones.filter(o => o.dias_atraso > 0).length}
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}