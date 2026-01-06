export default function ClienteScorePage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Puntaje crediticio</h1>
        <p className="text-slate-600">Consulta tu score.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        Aquí irá el score (API: /scores ...).
      </div>
    </div>
  );
}
