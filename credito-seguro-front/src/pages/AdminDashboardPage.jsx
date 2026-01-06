import TablaAdmin from '../components/Admin/TablaAdmin';

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-dark">Panel de Administración</h1>
                        <p className="text-light">Gestiona las disputas de los usuarios.</p>
                    </div>
                </header>

                <TablaAdmin />
            </div>
        </div>
    );
}