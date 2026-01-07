import api from "./axios";


export const registrarUsuarioRequest = (data) => {
  return api.post("/usuarios", data);
};
