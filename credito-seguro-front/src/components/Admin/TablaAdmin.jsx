import { useEffect, useState } from 'react';
import { obtenerTodasReclamacionesRequest, obtenerEvidenciaRequest } from '../../api/reclamaciones';
import { Toaster, toast } from 'react-hot-toast'; 

export default function TablaAdmin() {
    const [reclamaciones, setReclamaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const res = await obtenerTodasReclamacionesRequest();
            setReclamaciones(res.data);
        } catch (error) {
            console.error("Error cargando admin dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerEvidencia = async (urlCompleta) => {
        if (!urlCompleta) return toast.error("No hay evidencia adjunta");

        const toastId = toast.loading("Recuperando archivo seguro...");
        try {
            const nombreArchivo = urlCompleta.split('/').pop();

            const response = await obtenerEvidenciaRequest(nombreArchivo);

            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

            window.open(urlBlob, '_blank');
            toast.success("Archivo abierto", { id: toastId });

        } catch (error) {
            console.error(error);
            toast.error("Error: No se pudo cargar el archivo", { id: toastId });
        }
    };

    if (loading) return <div className="p-8 text-center text-primary">Cargando panel de control...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Toaster position="top-right" />
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Folio</th>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Usuario</th>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Entidad</th>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Evidencia</th>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-light uppercase">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reclamaciones.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-dark">{rec.folio}</td>
                                
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-dark">{rec.Usuario?.nombre}</div>
                                    <div className="text-xs text-light">{rec.Usuario?.correo}</div>
                                </td>

                                <td className="px-6 py-4 text-sm text-dark">{rec.Entidad?.nombreLegal}</td>

                                <td className="px-6 py-4">
                                    {rec.evidenciaUrl ? (
                                        <button 
                                            onClick={() => handleVerEvidencia(rec.evidenciaUrl)}
                                            className="text-xs bg-blue-50 text-primary px-2 py-1 rounded hover:bg-blue-100 font-medium transition-colors"
                                        >
                                            Ver Archivo 📎
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400">Sin archivo</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full 
                                        ${rec.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${rec.estado === 'RESUELTO' ? 'bg-green-100 text-green-800' : ''}
                                        ${rec.estado === 'RECHAZADO' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {rec.estado}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {rec.estado === 'PENDIENTE' && (
                                        <button 
                                            className="btn-primary text-xs px-3 py-1.5"
                                            onClick={() => alert(`Aquí abriremos el modal para el ID: ${rec.id}`)}
                                        >
                                            Atender
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}