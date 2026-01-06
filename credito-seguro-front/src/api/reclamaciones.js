import axios from './axios'; 

export const crearReclamacionRequest = async (datos) => {
    return axios.post('/reclamaciones', datos);
};

export const obtenerReclamacionesRequest = async () => {
    return axios.get('/reclamaciones/mis-reclamaciones');
};

export const obtenerTodasReclamacionesRequest = async () => {
    return axios.get('/reclamaciones/admin/todas');
};

export const obtenerEvidenciaRequest = async (nombreArchivo) => {
    return axios.get(`/reclamaciones/evidencia/${nombreArchivo}`, {
        responseType: 'blob' // Esto le dice a axios que viene un archivo, no un JSON
    });
};

export const atenderReclamacionRequest = async (id, datos) => {
    // datos debe ser { respuestaAdmin: "...", estado: "RESUELTO" }
    return axios.patch(`/reclamaciones/${id}/atender`, datos);
};