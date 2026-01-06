import { Navigate } from "react-router-dom";

function getRedirectPath(usuario) {
  const rol = usuario?.rol;
  const tipo = usuario?.entidad?.tipoEntidad;

  if (rol === "ADMINISTRADOR") return "/admin";
  if (tipo === "MORAL") return "/banco";
  return "/cliente";
}

export default function RequireAuth({ children, allow }) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // No autenticado
  if (!token || !usuario) return <Navigate to="/login" replace />;

  const rol = usuario?.rol;
  const tipoEntidad = usuario?.entidad?.tipoEntidad;

  // allow puede ser: "ADMIN", "BANCO", "CLIENTE"
  const ok =
    (allow === "ADMIN" && rol === "ADMINISTRADOR") ||
    (allow === "BANCO" && rol === "USUARIO" && tipoEntidad === "MORAL") ||
    (allow === "CLIENTE" && rol === "USUARIO" && tipoEntidad === "FISICA");

  if (!ok) {
    return <Navigate to={getRedirectPath(usuario)} replace />;
  }

  return children;
}
