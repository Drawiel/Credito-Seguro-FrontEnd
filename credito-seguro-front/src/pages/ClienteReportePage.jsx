import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { obtenerDatosReporteCredito } from "@/services/reporteCredito.service";
import { generarPdfReporteCredito, descargarPdf } from "@/utils/reporteCreditoPdf";

export default function ClienteReportePage() {
  const [rfc, setRfc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await axiosPrivate.get("/usuarios/me");
        const entidad =
          res.data?.datos?.entidad ?? res.data?.entidad;

        if (!entidad?.rfc) {
          setError("No se pudo obtener el RFC del usuario.");
          return;
        }

        setRfc(entidad.rfc);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar la información del usuario.");
      }
    };

    cargarPerfil();
  }, []);

  const onGenerar = async () => {
    setError("");

    if (!rfc) {
      setError("RFC no disponible para generar el reporte.");
      return;
    }

    try {
      setLoading(true);

      const data = await obtenerDatosReporteCredito(rfc);
      const doc = generarPdfReporteCredito(data);

      descargarPdf(doc, `reporte_credito_${rfc}.pdf`);
    } catch (e) {
      const status = e?.response?.status;

      if (status === 403) {
        setError("No tienes consentimiento para consultar este historial.");
      } else if (status === 429) {
        setError("Límite de consultas alcanzado. Intenta más tarde.");
      } else {
        setError(
          e?.response?.data?.message ||
          e?.message ||
          "No se pudo generar el reporte."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Reporte de crédito
        </h1>
        <p className="text-slate-600">
          Genera y descarga tu reporte de crédito en formato PDF.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        <button
          onClick={onGenerar}
          disabled={loading || !rfc}
          className="px-4 py-2 rounded-md bg-slate-900 text-white disabled:opacity-60"
        >
          {loading ? "Generando reporte..." : "Generar reporte PDF"}
        </button>
      </div>
    </div>
  );
}
