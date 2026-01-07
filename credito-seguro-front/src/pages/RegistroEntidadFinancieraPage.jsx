import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import { registrarEntidadFinancieraRequest } from "../api/registroEntidadFinanciera";

export default function RegistroEntidadFinancieraPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreLegal: "",
    rfc: "",
    nombreOperador: "",
    correoOperador: "",
    contraseñaOperador: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [exito, setExito] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (form.nombreLegal.trim().length < 3) return "El nombre legal debe tener al menos 3 caracteres.";
    const rfc = form.rfc.trim().toUpperCase();
    if (rfc.length !== 12) return "El RFC para persona MORAL debe tener 12 caracteres.";
    if (!form.nombreOperador.trim()) return "El nombre del operador es requerido.";
    if (!form.correoOperador.trim()) return "El correo del operador es requerido.";
    if (!form.contraseñaOperador.trim()) return "La contraseña del operador es requerida.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral("");
    setExito("");

    const msg = validar();
    if (msg) {
      setErrorGeneral(msg);
      return;
    }

    try {
      setLoading(true);

      await registrarEntidadFinancieraRequest({
        nombreLegal: form.nombreLegal.trim(),
        rfc: form.rfc.trim().toUpperCase(),
        nombreOperador: form.nombreOperador.trim(),
        correoOperador: form.correoOperador.trim(),
        contraseñaOperador: form.contraseñaOperador,
      });

      setExito("Registro enviado/creado correctamente. Ya puedes iniciar sesión con el usuario creado.");
      // opcional: redirigir automático
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      const mensajeApi =
        err?.response?.data?.mensaje ||
        err?.response?.data?.error ||
        "No se pudo registrar la entidad financiera.";
      setErrorGeneral(mensajeApi);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* IZQUIERDA: texto grande como la imagen */}
          <section className="pt-4">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Registra tu
              <br />
              entidad financiera
            </h1>

            <p className="mt-6 text-lg text-slate-600">
              Crea tu entidad (tipo <span className="font-semibold">MORAL</span>) y un usuario operador para acceder al
              sistema de consultas crediticias.
            </p>

            <p className="mt-4 text-slate-600">
              Si ya tienes cuenta, entra aquí:{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Iniciar sesión
              </button>
            </p>
          </section>

          {/* DERECHA: formulario estilo la imagen */}
          <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre legal</label>
                <input
                  name="nombreLegal"
                  value={form.nombreLegal}
                  onChange={onChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Banco Crédito Seguro S.A. de C.V."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">RFC (Moral - 12 caracteres)</label>
                <input
                  name="rfc"
                  value={form.rfc}
                  onChange={onChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. ABC010203XYZ"
                />
              </div>

              <div className="pt-2 border-t border-slate-200" />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del operador</label>
                <input
                  name="nombreOperador"
                  value={form.nombreOperador}
                  onChange={onChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico (operador)</label>
                <input
                  type="email"
                  name="correoOperador"
                  value={form.correoOperador}
                  onChange={onChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="operador@entidad.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña (operador)</label>
                <input
                  type="password"
                  name="contraseñaOperador"
                  value={form.contraseñaOperador}
                  onChange={onChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                />
              </div>

              {/* Campo opcional para verse como la imagen */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje (opcional)</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={onChange}
                  rows={4}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe un mensaje (no afecta el registro)."
                />
              </div>

              {errorGeneral && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-md p-3 text-sm">
                  {errorGeneral}
                </div>
              )}

              {exito && (
                <div className="bg-green-50 text-green-700 border border-green-200 rounded-md p-3 text-sm">
                  {exito}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
