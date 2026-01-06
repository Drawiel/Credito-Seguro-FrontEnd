import { useEffect, useState } from 'react';
import { obtenerReclamacionesRequest } from '../../api/reclamaciones';

export default function TablaReclamaciones() {
    const [reclamaciones, setReclamaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await obtenerReclamacionesRequest();
                setReclamaciones(res.data);
            } catch (error) {
                console.error("Error cargando reclamaciones", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (reclamaciones.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-dark font-medium mb-2">No tienes reclamaciones activas</p>
                <p className="text-light text-sm">Si encuentras un error en tu historial, inicia una disputa.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <caption className="sr-only">Lista de reclamaciones registradas y su estado actual</caption>
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-light uppercase tracking-wider">Folio</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-light uppercase tracking-wider">Entidad</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-light uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-light uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-light uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reclamaciones.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm font-medium text-primary">
                                    {rec.folio}
                                </td>
                                <td className="px-6 py-4 text-sm text-dark">
                                    {rec.Entidad?.nombreLegal || 'Desconocido'}
                                </td>
                                <td className="px-6 py-4 text-sm text-light">
                                    {new Date(rec.fechaCreacion).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full 
                                        ${rec.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${rec.estado === 'RESUELTO' ? 'bg-green-100 text-green-800' : ''}
                                        ${rec.estado === 'RECHAZADO' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {rec.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-sm font-medium text-secondary hover:text-secondary-hover transition-colors">
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}