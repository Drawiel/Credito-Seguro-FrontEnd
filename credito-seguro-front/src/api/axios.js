import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// 1. Instancia Pública (para Login, Registro, cosas que no piden token)
export default axios.create({
    baseURL: BASE_URL
});

// 2. Instancia Privada (para todo lo demás: Usuarios, Entidades, etc.)
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // Para el uso de cookies
});

// INTERCEPTORES

// A) Antes de enviar: Pegar el token si lo tenemos
axiosPrivate.interceptors.request.use(
    config => {
        // Buscamos el token en la memoria 
        // Por seguridad, idealmente el token viene del AuthContext, pero aquí verificamos el header
        const token = localStorage.getItem('token'); // Simplificación inicial
        if (!config.headers['Authorization'] && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);

// B) Al recibir respuesta: Si es un error 401, intentar renovar token
axiosPrivate.interceptors.response.use(
    response => response, 
    async (error) => {
        const prevRequest = error?.config;

        if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
            prevRequest.sent = true; 

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data?.datos?.token || response.data?.token;

                localStorage.setItem('token', newAccessToken);

                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosPrivate(prevRequest);
            } catch (err) {
                console.error("Sesión expirada, log out", err);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);