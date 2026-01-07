import { useState, useEffect } from 'react';
import { calcularScoreRequest } from '../api/scores';

export default function ClienteScorePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entidad, setEntidad] = useState(null);
  const [scoring, setScoring] = useState(null);
  const [consultasRestantes, setConsultasRestantes] = useState(0);

  useEffect(() => {
    calcularScore();
  }, []);

  const calcularScore = async () => {
    try {
      setLoading(true);
      setError('');
      
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const rfc = usuario?.entidad?.rfc;
      
      if (!rfc) {
        setError('No se encontró el RFC del usuario');
        return;
      }

      const response = await calcularScoreRequest(rfc)
      
      if (response.data.error === false) {
        setEntidad(response.data.datos.entidad);
        setScoring(response.data.datos.scoring);
        setConsultasRestantes(response.data.datos.consultasRestantes);
      }
    } catch (err) {
      console.error('Error al calcular score:', err);
      setError(err.response?.data?.mensaje || 'Error al calcular el score crediticio');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIconoPrioridad = (prioridad) => {
    const iconos = {
      'ALTA': '🔴',
      'MEDIA': '🟡',
      'BAJA': '🟢'
    };
    return iconos[prioridad] || '⚪';
  };

  if (loading) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Puntaje Crediticio</h1>
          <p className="text-slate-600">Consulta tu score.</p>
        </header>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Calculando tu score crediticio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Puntaje Crediticio</h1>
          <p className="text-slate-600">Consulta tu score.</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={calcularScore}
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
        <h1 className="text-2xl font-bold text-slate-900">Puntaje Crediticio</h1>
        <p className="text-slate-600">Consulta tu score.</p>
      </header>

      {entidad && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-blue-900 mb-1">Información del Titular</h2>
              <div className="text-sm">
                <span className="text-blue-700 font-medium">{entidad.nombreLegal}</span>
                <span className="text-blue-600 ml-3">RFC: {entidad.rfc}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-700">Consultas restantes</div>
              <div className="text-2xl font-bold text-blue-900">{consultasRestantes}</div>
            </div>
          </div>
        </div>
      )}

      {scoring && (
        <>
          <div className="bg-gradient-to-br from-white to-slate-50 border-2 rounded-lg p-8 mb-6 text-center" style={{ borderColor: scoring.nivelRiesgo.color }}>
            <div className="mb-4">
              <div className="text-6xl font-bold mb-2" style={{ color: scoring.nivelRiesgo.color }}>
                {scoring.scoreTotal}
              </div>
              <div className="text-sm text-slate-500">de 1000 puntos</div>
            </div>
            <div className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-2" style={{ backgroundColor: scoring.nivelRiesgo.color }}>
              {scoring.nivelRiesgo.nivel}
            </div>
            <p className="text-slate-700 mt-2">{scoring.nivelRiesgo.descripcion}</p>
            <p className="text-sm text-slate-500 mt-1">Rango: {scoring.nivelRiesgo.rango}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Componentes del Score</h2>
            <div className="space-y-4">
              {Object.entries(scoring.componentes).map(([key, componente]) => {
                const nombres = {
                  historialPagos: 'Historial de Pagos',
                  nivelEndeudamiento: 'Nivel de Endeudamiento',
                  antiguedadCrediticia: 'Antigüedad Crediticia',
                  mixCrediticio: 'Mix Crediticio',
                  comportamientoReciente: 'Comportamiento Reciente'
                };
                
                return (
                  <div key={key} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-slate-800">{nombres[key]}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-900">{componente.puntos}</span>
                        <span className="text-sm text-slate-500 ml-2">pts ({componente.porcentaje}%)</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${componente.porcentaje}%`,
                          backgroundColor: parseFloat(componente.porcentaje) >= 80 ? '#10B981' : 
                                         parseFloat(componente.porcentaje) >= 50 ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>

                    {componente.positivos && componente.positivos.length > 0 && (
                      <div className="mb-2">
                        {componente.positivos.map((positivo, idx) => (
                          <div key={idx} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{positivo}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {componente.negativos && componente.negativos.length > 0 && (
                      <div>
                        {componente.negativos.map((negativo, idx) => (
                          <div key={idx} className="text-sm text-red-700 flex items-start gap-2">
                            <span className="text-red-500">✗</span>
                            <span>{negativo}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {componente.tiposCredito && componente.tiposCredito.length > 0 && (
                      <div className="text-sm text-slate-600">
                        Tipos de crédito: {componente.tiposCredito.join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Factores Positivos
              </h2>
              <ul className="space-y-2">
                {scoring.factoresPositivos.map((factor, idx) => (
                  <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">✗</span>
                Factores Negativos
              </h2>
              {scoring.factoresNegativos.length === 0 ? (
                <p className="text-sm text-red-700 italic">No se encontraron factores negativos</p>
              ) : (
                <ul className="space-y-2">
                  {scoring.factoresNegativos.map((factor, idx) => (
                    <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {scoring.recomendaciones && scoring.recomendaciones.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recomendaciones</h2>
              <div className="space-y-4">
                {scoring.recomendaciones.map((recomendacion, idx) => (
                  <div key={idx} className="border-l-4 pl-4 py-2" style={{ 
                    borderColor: recomendacion.prioridad === 'ALTA' ? '#EF4444' : 
                                recomendacion.prioridad === 'MEDIA' ? '#F59E0B' : '#10B981'
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{obtenerIconoPrioridad(recomendacion.prioridad)}</span>
                        <h3 className="font-semibold text-slate-900">{recomendacion.titulo}</h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                          {recomendacion.prioridad}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {recomendacion.categoria}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{recomendacion.descripcion}</p>
                    <p className="text-xs text-slate-500">Impacto: {recomendacion.impacto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-600">
              Score calculado el {formatearFecha(scoring.fechaCalculo)}
            </p>
            <button 
              onClick={calcularScore}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Recalcular Score
            </button>
          </div>
        </>
      )}
    </div>
  );
}