import { axiosPrivate } from "@/api/axios"; // ajusta el path real

const pick = (res) => res?.data?.datos ?? res?.data;

export async function obtenerDatosReporteCredito(rfc) {
  const r = encodeURIComponent(rfc);

  // 1) Historial crediticio completo (trae entidad + resumen + obligaciones + pagos)
  const historialCompletoRes = await axiosPrivate.get(`/historial-crediticio/${r}/completo`);
  const historialCompleto = pick(historialCompletoRes);

  // 2) Traer último scoring. Si no existe, lo calculamos.
  let ultimoScoring;
  try {
    const ultimoRes = await axiosPrivate.get(`/scores/ultimo/${r}`);
    ultimoScoring = pick(ultimoRes);
  } catch (err) {
    const status = err?.response?.status;
    if (status === 404) {
      await axiosPrivate.post(`/scores/${r}/calcular`);
      const ultimoRes2 = await axiosPrivate.get(`/scores/ultimo/${r}`);
      ultimoScoring = pick(ultimoRes2);
    } else {
      throw err;
    }
  }

  // 3) Historial de scoring
  const historialScoreRes = await axiosPrivate.get(`/scores/historial/${r}`);
  const historialScore = pick(historialScoreRes);

  return {
    rfc,
    generadoEn: new Date().toISOString(),
    historialCompleto,  // { entidad, resumenCrediticio, obligaciones, pagos, consultasRestantes }
    ultimoScoring,      // { entidad, scoring: {...} }
    historialScore,     // { entidad, historial: [...], totalRegistros }
  };
}
