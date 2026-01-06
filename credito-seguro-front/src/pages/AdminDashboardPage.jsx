import TablaAdmin from "../components/Admin/TablaAdmin";

export default function AdminDashboardPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Atender reclamaciones</h1>
        <p className="text-slate-600">Gestiona las disputas de los usuarios.</p>
      </header>

      <TablaAdmin />
    </div>
  );
}
