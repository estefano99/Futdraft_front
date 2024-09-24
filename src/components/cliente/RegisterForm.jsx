import { Button, Typography } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";

const RegisterForm = ({ isRegister, setIsRegister, setAlert }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { registerUser, setUser } = useAuth();
  const [loadingBTN, setIsLoadingBTN] = useState(false);
  const onSubmit = async (data) => {
    try {
      setIsLoadingBTN(true);
      const respuesta = await registerUser(data);
      setAlert({
        color: "green",
        message: `Usuario ${respuesta.nombre} Creado correctamente. Ingresando al sistema...`,
      });

      let timer;
      if (alert) {
        timer = setTimeout(() => {
          setIsLoadingBTN(false);
          setUser(respuesta);
        }, 3000);
      }
      return () => clearTimeout(timer);
    } catch (error) {
      console.log(error);
      setIsLoadingBTN(false);
      if (error.response.data.errors) {
        const errorMsg = Object.values(error.response.data.errors)
          .flat() // Aplana el array de errores, en caso de que haya más de uno por campo
          .join(", "); // Une todos los errores en una sola cadena, separados por comas

        return setAlert({
          color: "red",
          message: errorMsg,
        });
      }
      setAlert({
        color: "red",
        message: "Hubo un error al procesar su registro, intentelo nuevamente.",
      });
    }
  };

  const handleLogin = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="w-5/6 py-2 mx-auto lg:w-2/4">
      <form
        className="bg-login-form shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row justify-between md:gap-4">
          <div className="flex-1 md:mb-6">
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="nombre"
            >
              NOMBRE
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              {...register("nombre", {
                required: "Nombre es requerido",
              })}
            />
            {errors.nombre && (
              <span className="text-red-300">
                {errors.nombre.message
                  ? errors.nombre.message
                  : "Campos incompletos"}
              </span>
            )}
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="apellido"
            >
              APELLIDO
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="apellido"
              type="text"
              placeholder="Ingresa tu apellido"
              {...register("apellido", {
                required: "Apellido es requerido",
              })}
            />
            {errors.apellido && (
              <span className="text-red-300">
                {errors.apellido.message
                  ? errors.apellido.message
                  : "Campos incompletos"}
              </span>
            )}
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="email"
            >
              EMAIL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="contrasenia"
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
          </div>
          <div className="flex-1 mb-6">
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="password"
            >
              CONTRASEÑA
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="off"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-300">
                {errors.password.message
                  ? errors.password.message
                  : "Campos incompletos"}
              </span>
            )}
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="dni"
            >
              DNI
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="dni"
              type="string"
              placeholder="Ingresa tu documento de identidad"
              {...register("dni", {
                required: "DNI es requerido",
              })}
            />
            {errors.dni && (
              <span className="text-red-300">
                {errors.dni.message ? errors.dni.message : "Campos incompletos"}
              </span>
            )}
            <label
              className="sans-pro block text-blue-gray-100 font-semibold text-lg"
              htmlFor="nro_celular"
            >
              Número de celular
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none shadow-inset bg-slate-300"
              id="nro_celular"
              type="string"
              placeholder="Ingresa tu número de celular"
              {...register("nro_celular", {
                required: "Número de celular es requerido",
              })}
            />
            {errors.nro_celular && (
              <span className="text-red-300">
                {errors.nro_celular.message
                  ? errors.nro_celular.message
                  : "Campos incompletos"}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between">
          <Button
            className="carter w-full bg-sbc-yellow hover:bg-yellow-600 text-cta-azul font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text text-lg"
            type="submit"
            loading={loadingBTN ? true : false}
          >
            Registrarse
          </Button>
          <Typography color="white" className="mt-4 text-center font-normal">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={handleLogin}
              className="font-medium text-light-blue-500 hover:text-light-blue-300 transition-all"
            >
              Inicia sesión
            </button>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
