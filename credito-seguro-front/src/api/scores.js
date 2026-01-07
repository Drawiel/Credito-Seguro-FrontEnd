import  { axiosPrivate } from './axios';

export const calcularScoreRequest = async (rfc) => {
  return axiosPrivate.post(`/scores/${rfc}/calcular`);
};
