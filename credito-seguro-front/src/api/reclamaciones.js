import axios from 'axios'; 

export const crearReclamacionRequest = async (reclamacion) => {
    const form = new FormData();
    form.append('motivo', reclamacion.motivo);
    form.append('idHistorialScore', reclamacion.idHistorialScore);
    
    if (reclamacion.evidencia && reclamacion.evidencia[0]) {
        form.append('evidencia', reclamacion.evidencia[0]);
    }

    return axios.post('/reclamaciones', form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};