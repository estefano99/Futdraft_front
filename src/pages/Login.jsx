import { useState, useEffect } from "react";
import LoginForm from "../components/cliente/LoginForm";
import RegisterForm from "../components/cliente/RegisterForm";
import { AlertColors } from "../components/Alert";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { rutaGeneral, rutaGeneralAdmin } from "../libs/constantes";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { user, errorAuth, isLoading } = useAuth();

  // Redirige al usuario basado en su rol después de autenticarse
  useEffect(() => {
    // if (errorAuth) return navigate("/");
    if (user?.tipo_usuario === "admin") return navigate(rutaGeneralAdmin);
    if (user?.tipo_usuario === "cliente") return navigate(rutaGeneral);
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  // if (isLoading) return <div>Cargando...</div>;
  return (
    <div className=" bg-gradient-to-b from-sbc-blue to-blue-600 min-h-screen texture">
      <div className="pt-6 px-8 pb-4 mb-4 w-full mx-auto shadow-md separator">
        <h2 className="text-2xl text-center text-yellow-300 carter separator-text">
          FUT DRAFT
        </h2>
      </div>
      {/* Escudo */}
      <div className="w-full h-44 md-escudo flex justify-center md-mb">
        <img
          className="h-full drop-shadow-2xl"
          src="../../escudo-sbc.png"
          alt="Escudo SBC"
        />
      </div>
      {alert && (
        <div className="w-2/4 mx-auto">
          {" "}
          <AlertColors alert={alert} />
        </div>
      )}

      {!isRegister ? (
        <LoginForm
          setIsRegister={setIsRegister}
          isRegister={isRegister}
          setAlert={setAlert}
        />
      ) : (
        <RegisterForm
          setIsRegister={setIsRegister}
          isRegister={isRegister}
          setAlert={setAlert}
        />
      )}
    </div>
  );
};

export default Login;
