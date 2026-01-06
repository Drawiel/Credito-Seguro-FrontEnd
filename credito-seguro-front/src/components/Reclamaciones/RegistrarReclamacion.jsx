import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reclamacionSchema } from '../../schemas/reclamacionesSchema';
import { crearReclamacionRequest } from '../../api/reclamaciones';
import { useState } from 'react';

export default function RegistrarReclamacion({ registro, onClose, onExito }) {
    const [errorGeneral, setErrorGeneral] = useState(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(reclamacionSchema),
        defaultValues: {
            idHistorialScore: registro.id // ID del registro seleccionado
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await crearReclamacionRequest(data);
            onExito(res.data.datos.folio); 
            onClose();
        } catch (error) {
            console.error(error);
            setErrorGeneral("Error técnico: No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md window_registrar_reclamacion" role="dialog" aria-labelledby="titulo-modal">
                <h2 id="titulo-modal" className="text-xl font-bold mb-4">Iniciar Disputa</h2>
                
                <p className="mb-4 text-gray-700">
                    Estás registrando una inconformidad para la entidad: <strong>{registro.Entidad.nombreLegal}</strong>
                </p>

                {errorGeneral && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded alert_error" role="alert">
                        {errorGeneral}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    {/* Campo oculto para el ID */}
                    <input type="hidden" {...register('idHistorialScore', { valueAsNumber: true })} />

                    {/* Campo Motivo */}
                    <div className="mb-4">
                        <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">Motivo (Obligatorio)</label>
                        <textarea
                            id="motivo"
                            rows="4"
                            className={`mt-1 block w-full border rounded-md p-2 ${errors.motivo ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('motivo')}
                            aria-invalid={errors.motivo ? "true" : "false"}
                        ></textarea>
                        {errors.motivo && <span className="text-red-500 text-sm">{errors.motivo.message}</span>}
                    </div>

                    {/* Campo Evidencia */}
                    <div className="mb-6">
                        <label htmlFor="evidencia" className="block text-sm font-medium text-gray-700">Evidencia (Opcional - PDF/Img)</label>
                        <input
                            type="file"
                            id="evidencia"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="mt-1 block w-full text-sm text-gray-500"
                            {...register('evidencia')}
                        />
                        {errors.evidencia && <span className="text-red-500 text-sm">{errors.evidencia.message}</span>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Reclamación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}