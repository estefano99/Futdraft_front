import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { rutaGeneralAdmin } from "../libs/constantes";

const AdminLayout = () => {
  const { user, isLoading, modulos } = useAuth();
  const location = useLocation();

  // Redirigir al primer módulo si estás en la base
  const firstModuleRoute =
    modulos && modulos.length > 0
      ? `/dashboard/${modulos[0].nombre.toLowerCase().replace(/ /g, "-")}`
      : null;

  if (isLoading) return <div>CARGANDO...</div>;

  // Si no hay módulos, redirigir al login
  if (!modulos || modulos.length === 0) {
    return <Navigate to="/" replace />;
  }

  // Si estás en la base del dashboard, redirigir al primer módulo
  if (location.pathname === rutaGeneralAdmin && firstModuleRoute) {
    return <Navigate to={firstModuleRoute} replace />;
  }

  return (
    <section className="min-h-screen bg-sbc-login">
      <main className="min-h-full">
        <div className="absolute top-5 left-5">
          <Sidebar />
        </div>
        <Outlet />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
    </section>
  );
};

export default AdminLayout;
