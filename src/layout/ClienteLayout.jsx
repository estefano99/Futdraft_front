import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClienteLayout = () => {
  const navigate = useNavigate();
  const { user, errorAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!user) return; // Solo continuar si hay un usuario autenticado

    // Redirigir si el usuario no es del tipo cliente
    if (user.tipo_usuario !== "cliente" && window.location.pathname !== "/") {
      navigate("/"); // Redirige al inicio solo si no estás en la ruta correcta
    }
  }, [user, navigate, errorAuth]);

  if (isLoading) return <div>CARGANDO...</div>;

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

export default ClienteLayout;
