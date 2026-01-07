import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import { registrarUsuarioRequest } from "../api/registroUsuarios";

export default function RegistroCuentaClientePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    rfc: "",
    correo: "",
    contrasenia: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [exito, setExito] = useState("");

  // ===== VALIDACIONES =====
  const validarNombre = (nombre) => {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!regex.test(nombre)) return "Solo letras y espacios.";
    if (nombre.trim().split(" ").length < 2) return "Ingresa tu nombre completo.";
    return "";
  };

  const validarRFC = (rfc) => {
    const regex = /^[A-Z0-9]{13}$/;
    if (!regex.test(rfc)) return "RFC inválido (13 caracteres).";
    return "";
  };

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correo)) return "Correo inválido.";
    return "";
  };

  const validarContrasenia = (pass) => {
    if (pass.length < 5) return "Mínimo 5 caracteres.";
    if (!/[A-Z]/.test(pass)) return "Debe tener una mayúscula.";
    if (!/[0-9]/.test(pass)) return "Debe tener un número.";
    return "";
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (name === "nombreCompleto") error = validarNombre(value);
    if (name === "rfc") error = validarRFC(value.toUpperCase());
    if (name === "correo") error = validarCorreo(value);
    if (name === "contrasenia") error = validarContrasenia(value);

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 🔒 Bandera global de validez
  const isFormValid =
    form.nombreCompleto &&
    form.rfc &&
    form.correo &&
    form.contrasenia &&
    !errors.nombreCompleto &&
    !errors.rfc &&
    !errors.correo &&
    !errors.contrasenia;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      setErrorGeneral("");
      setExito("");

      await registrarUsuarioRequest({
        nombre: form.nombreCompleto.trim(),
        nombreLegal: form.nombreCompleto.trim(),
        rfc: form.rfc.toUpperCase(),
        correo: form.correo.trim(),
        contraseña: form.contrasenia,
        tipoEntidad: "FISICA",
      });

      setExito("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      const mensajeApi =
        err?.response?.data?.mensaje ||
        err?.response?.data?.error ||
        "No se pudo crear la cuenta.";
      setErrorGeneral(mensajeApi);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        {/* IZQUIERDA */}
        <section>
          <h1 className="text-5xl font-bold text-slate-900">
            Crea tu cuenta <br /> como cliente
          </h1>

          <p className="mt-6 text-slate-600 text-lg">
            Registra tu cuenta personal para consultar tu historial crediticio.
          </p>

          <p className="mt-4">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </section>

        {/* FORMULARIO */}
        <section className="bg-white border rounded-lg p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre completo</label>
              <input
                name="nombreCompleto"
                value={form.nombreCompleto}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Juan Pérez López"
              />
              {errors.nombreCompleto && (
                <p className="text-red-600 text-sm">{errors.nombreCompleto}</p>
              )}
            </div>

            {/* RFC */}
            <div>
              <label className="block text-sm font-medium mb-1">RFC</label>
              <input
                name="rfc"
                value={form.rfc}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2 uppercase"
                placeholder="PEPJ800101ABC"
              />
              {errors.rfc && <p className="text-red-600 text-sm">{errors.rfc}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.correo && <p className="text-red-600 text-sm">{errors.correo}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="contrasenia"
                  value={form.contrasenia}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-sm text-blue-600"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.contrasenia && (
                <p className="text-red-600 text-sm">{errors.contrasenia}</p>
              )}
            </div>

            {/* Mensajes */}
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
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-md font-medium text-white
                ${
                  isFormValid && !loading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
