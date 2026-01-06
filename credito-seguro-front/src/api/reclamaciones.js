import  { axiosPrivate } from './axios';

// Público o protegido según tu backend:
// Si /reclamaciones (crear) requiere JWT, usa axiosPrivate.
// Si es público, deja api.

export const crearReclamacionRequest = async (datos) => {
  return axiosPrivate.post('/reclamaciones', datos);
};

export const obtenerReclamacionesRequest = async () => {
  return axiosPrivate.get('/reclamaciones/mis-reclamaciones');
};

export const obtenerTodasReclamacionesRequest = async () => {
  return axiosPrivate.get('/reclamaciones/admin/todas');
};

export const obtenerEvidenciaRequest = async (nombreArchivo) => {
  return axiosPrivate.get(`/reclamaciones/evidencia/${nombreArchivo}`, {
    responseType: 'blob'
  });
};

export const atenderReclamacionRequest = async (id, datos) => {
  return axiosPrivate.patch(`/reclamaciones/${id}/atender`, datos);
};
