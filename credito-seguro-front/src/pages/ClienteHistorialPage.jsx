import { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { obtenerObligaciones } from '../api/historialCrediticio.js';

export default function ClienteHistorialPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entidad, setEntidad] = useState(null);
  const [obligaciones, setObligaciones] = useState([]);
  const [consultasRestantes, setConsultasRestantes] = useState(0);

  useEffect(() => {
    obtenerHistorial();
  }, []);

  const obtenerHistorial = async () => {
    try {
      setLoading(true);
      setError('');
      
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const rfc = usuario?.entidad?.rfc;
      
      if (!rfc) {
        setError('No se encontró el RFC del usuario');
        return;
      }

      const response = await obtenerObligaciones(rfc)
      if (response.data.error === false) {
        setEntidad(response.data.datos.entidad);
        setObligaciones(response.data.datos.obligaciones.datos || []);
        setConsultasRestantes(response.data.datos.consultasRestantes);
      }
    } catch (err) {
      console.error('Error al obtener historial:', err);
      setError(err.response?.data?.mensaje || 'Error al cargar el historial crediticio');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Historial Crediticio</h1>
          <p className="text-slate-600">Consulta tu historial crediticio propio.</p>
        </header>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Historial Crediticio</h1>
          <p className="text-slate-600">Consulta tu historial crediticio propio.</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={obtenerHistorial}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Historial Crediticio</h1>
        <p className="text-slate-600">Consulta tu historial crediticio propio.</p>
      </header>

      {entidad && (
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
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {obligaciones.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No se encontraron obligaciones crediticias
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
    </div>
  );
}