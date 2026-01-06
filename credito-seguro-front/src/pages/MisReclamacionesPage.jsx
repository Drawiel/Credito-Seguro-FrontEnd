import TablaReclamaciones from '../components/Reclamaciones/TablaReclamaciones';

export default function MisReclamacionesPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado de la página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark">Mis Reclamaciones</h1>
                    <p className="text-light mt-2">
                        Consulta el estado de las disputas que has iniciado sobre tu historial crediticio.
                    </p>
                </div>

                {/* Aquí renderizamos el componente que creamos antes */}
                <TablaReclamaciones />
                
                {/* Botón para volver (opcional, por si quieres facilitar la navegación) */}
                <div className="mt-8 text-right">
                    <a href="/dashboard" className="text-primary hover:text-primary-hover font-medium text-sm">
                        &larr; Volver al Panel Principal
                    </a>
                </div>
            </div>
        </div>
    );
}