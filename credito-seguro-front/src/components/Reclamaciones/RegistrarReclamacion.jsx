import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reclamacionSchema } from '../../schemas/reclamacionesSchema';
import { crearReclamacionRequest } from '../../api/reclamaciones';
import { useState } from 'react';
import { useEffect } from 'react';

const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

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
            let evidenciaBase64 = null;
            if (data.evidencia && data.evidencia[0]) {
                evidenciaBase64 = await convertirABase64(data.evidencia[0]);
            }

            const payload = {
                motivo: data.motivo,
                idHistorialScore: registro.id,
                evidencia: evidenciaBase64 
            };

            const res = await crearReclamacionRequest(payload);
            onExito(res.data.datos.folio);
            onClose();
        } catch (error) {
            console.error(error);
            setErrorGeneral("Error técnico: No se pudo conectar con el servidor.");
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="modal-overlay">
            
            <div 
                className="modal-box" 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="titulo-modal"
            >
                <h2 id="titulo-modal" className="text-xl font-bold mb-4 text-dark">
                    Iniciar Disputa
                </h2>
                
                <p className="mb-4 text-dark">
                    Estás registrando una inconformidad para la entidad: 
                    <strong className="text-primary ml-1">{registro.Entidad.nombreLegal}</strong>
                </p>

                {errorGeneral && (
                    <div className="bg-red-50 text-red-700 p-3 mb-4 rounded-lg text-sm border border-red-200" role="alert">
                        {errorGeneral}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('idHistorialScore', { valueAsNumber: true })} />

                    <div className="mb-4">
                        <label htmlFor="motivo" className="label-standard">
                            Motivo (Obligatorio)
                        </label>
                        <textarea
                            id="motivo"
                            rows="4"
                            className={`input-standard ${errors.motivo ? 'border-red-500 focus:ring-red-500' : ''}`}
                            {...register('motivo')}
                            aria-invalid={errors.motivo ? "true" : "false"}
                            aria-describedby={errors.motivo ? "error-motivo" : undefined}
                        ></textarea>
                        
                        {errors.motivo && (
                            <span id="error-motivo" className="text-red-600 text-xs mt-1 font-medium">
                                {errors.motivo.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="evidencia" className="label-standard">
                            Evidencia (Opcional - PDF/Img)
                        </label>
                        <input
                            type="file"
                            id="evidencia"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-all"
                            {...register('evidencia')}
                        />
                        {errors.evidencia && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors.evidencia.message}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Reclamación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}