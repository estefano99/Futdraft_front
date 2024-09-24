import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ClienteLayout = () => {
  const navigate = useNavigate();
  const { user, errorAuth, isLoading } = useAuth();

  
  useEffect(() => {
    if (user && user.tipo_usuario !== "cliente") {
      return <Navigate to="/" />;
    }
  }, [user, navigate])

  // if (isLoading) return <div>CARGANDO...</div>;
  if (errorAuth) return  navigate("/");
  
  return (
    <section className="min-h-screen bg-sbc-login">
      <main className="min-h-full">
        <div className="absolute top-5 left-5">
          <Sidebar />
        </div>
        <Outlet />
      </main>
    </section>
  );
};

export default ClienteLayout;
