import TablaReclamaciones from "../components/Reclamaciones/TablaReclamaciones";

export default function MisReclamacionesPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mis Reclamaciones</h1>
        <p className="text-slate-600">
          Consulta el estado de las disputas que has iniciado.
        </p>
      </header>

      <TablaReclamaciones />
    </div>
  );
}
