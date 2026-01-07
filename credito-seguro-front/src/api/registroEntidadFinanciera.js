import api, { axiosPrivate } from "./axios";

// Si tu backend protege /entidades y /usuarios con JWT (admin), cambia usePrivate = true.
const usePrivate = false;

const http = usePrivate ? axiosPrivate : api;

export const registrarEntidadFinancieraRequest = async (payload) => {
  // payload esperado:
  // {
  //   nombreLegal, rfc,
  //   nombreOperador, correoOperador, contraseñaOperador
  // }

  // 1) crear entidad (MORAL)
  const resEntidad = await http.post("/entidades", {
    tipoEntidad: "MORAL",
    nombreLegal: payload.nombreLegal,
    rfc: payload.rfc,
  });

  const idEntidad =
    resEntidad.data?.datos?.entidad?.id ||
    resEntidad.data?.datos?.id ||
    resEntidad.data?.entidad?.id;

  if (!idEntidad) {
    throw new Error("No se recibió idEntidad al crear la entidad.");
  }

  // 2) crear usuario operador para esa entidad (MORAL)
  const resUsuario = await http.post("/usuarios", {
    tipoEntidad: "MORAL",
    idEntidad: idEntidad,
    nombre: payload.nombreOperador,
    correo: payload.correoOperador,
    contraseña: payload.contraseñaOperador,
  });

  return {
    entidad: resEntidad.data,
    usuario: resUsuario.data,
  };
};
