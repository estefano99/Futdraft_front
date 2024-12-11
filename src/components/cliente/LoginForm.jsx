import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";
import { notifyError } from "../../libs/funciones";

const LoginForm = ({ isRegister, setIsRegister, setAlert }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const respuesta = await login(data);
      if (!respuesta.modulos || respuesta.modulos.length === 0) {
        notifyError("No tienes permisos asignados para acceder al sistema.");
      }
    } catch (error) {
      const mensajeError =
        error.response && error.response.data.error
          ? error.response.data.error
          : "Error al iniciar sesión. Por favor, intenta nuevamente.";
      setAlert({
        color: "red",
        message: mensajeError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="w-5/6 mx-auto lg:w-2/4">
      <form
        className="bg-login-form shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6">
          <label
            className="sans-pro block text-blue-gray-100 font-semibold text-lg"
            htmlFor="email"
          >
            EMAIL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
            id="dni"
            type="email"
            placeholder="Ingresa tu correo electronico"
            {...register("email", {
              required: "Email es requerido",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Formato de mail invalido",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-300">
              {errors.email.message
                ? errors.email.message
                : "Campos incompletos"}
            </span>
          )}
          <label
            className="sans-pro block text-blue-gray-100 font-semibold text-lg"
            htmlFor="contrasenia"
          >
            CONTRASEÑA
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            autoComplete="off"
            {...register("password", { required: "Contraseña es requerido" })}
          />
          {errors.password && (
            <span className="text-red-300">
              {errors.password.message
                ? errors.password.message
                : "Campos incompletos"}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center justify-between">
          <button
            disabled={isSubmitting}
            className={`carter w-full bg-sbc-yellow hover:bg-yellow-600 text-cta-azul font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text text-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            {isSubmitting ? "Procesando..." : "Iniciar Sesión"}
          </button>
          <Typography color="white" className="mt-4 text-center font-normal">
            ¿No tienes una cuenta?{" "}
            <button
              onClick={handleRegister}
              className="font-medium text-light-blue-500 hover:text-light-blue-300 transition-all"
            >
              Registrate
            </button>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
