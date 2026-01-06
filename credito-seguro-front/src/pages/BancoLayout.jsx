import { Outlet } from "react-router-dom";
import BancoNavbar from "../components/layout/BancoNavbar";

export default function BancoLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BancoNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
