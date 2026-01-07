import  { axiosPrivate } from './axios';

export const obtenerObligaciones = async(rfc) => { 
 return axiosPrivate.get(`/historial-crediticio/${rfc}/obligaciones`);
}
