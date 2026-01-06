import { Outlet } from "react-router-dom";
import ClienteNavbar from "../components/layout/ClienteNavbar";

export default function ClienteLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClienteNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
