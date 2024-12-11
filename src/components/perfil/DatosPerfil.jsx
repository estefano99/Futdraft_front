import React from "react";
import { useEffect, useState } from "react";
import { Button, Typography, Input } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { notifyError, notifySuccess } from "../../libs/funciones";

const DatosPerfil = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { user, editarUsuario, setUser } = useAuth();

  const handleCancelar = () => {
    if (user) {
      setValue("nombre", user.nombre);
      setValue("apellido", user.apellido);
      setValue("email", user.email);
      setValue("nro_celular", user.nro_celular);
      setValue("dni", user.dni);
      setValue("estado", user.estado);
      setValue("id", user.id);
    }
  };

  useEffect(() => {
    if (user) {
      setValue("nombre", user.nombre);
      setValue("apellido", user.apellido);
      setValue("email", user.email);
      setValue("nro_celular", user.nro_celular);
      setValue("dni", user.dni);
      setValue("estado", user.estado);
      setValue("id", user.id);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const respuesta = await editarUsuario(data.id, data);
      setUser(respuesta.data.usuario);
      notifySuccess(respuesta.data.message);
    } catch (error) {
      console.log(error);
      notifyError("Hubo un error al actualizar el perfil");
    }
  };
  return (
    <div>
      <form
        className="w-full mx-auto gap-5 bg-white rounded-md overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col mx-auto flex-wrap gap-5 py-2 md:p-5 bg-white rounded-md">
          <Typography
            variant="h3"
            color="blue-gray"
            className="text-blue-700 font-semibold py-0 px-4"
          >
            Mis datos
          </Typography>
          <div className="flex flex-col md:flex-row mx-auto">
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Nombre <span className="text-red-300">*</span>
              </Typography>
              <Input
                type="text"
                label="nombre..."
                {...register("nombre", {
                  required: true,
                })}
              />
              {errors.nombre && (
                <span className="text-red-300">
                  {errors.nombre.message
                    ? errors.nombre.message
                    : "Campos incompletos"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Apellido <span className="text-red-300">*</span>
              </Typography>
              <Input
                type="text"
                label="apellido..."
                {...register("apellido", {
                  required: true,
                })}
              />
              {errors.apellido && (
                <span className="text-red-300">
                  {errors.apellido.message
                    ? errors.apellido.message
                    : "Campos incompletos"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Email <span className="text-red-300">*</span>
              </Typography>
              <Input
                type="email"
                label="email..."
                readOnly
                {...register("email", {
                  required: true,
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
          </div>
          <div className="flex flex-col md:flex-row mx-auto">
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Telefono
              </Typography>
              <Input
                type="text"
                label="nro_celular..."
                {...register("nro_celular")}
              />
              {errors.nro_celular && (
                <span className="text-red-300">
                  {errors.nro_celular.message
                    ? errors.nro_celular.message
                    : "Campos incompletos"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                DNI
              </Typography>
              <Input type="text" label="dni..." {...register("dni")} />
              {errors.dni && (
                <span className="text-red-300">
                  {errors.dni.message
                    ? errors.dni.message
                    : "Campos incompletos"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6 p-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Estado <span className="text-red-300">*</span>
              </Typography>
              <Input
                type="text"
                className="cursor-not-allowed"
                label="estado..."
                readOnly
                disabled
                {...register("estado", {
                  required: true,
                })}
              />
              {errors.estado && (
                <span className="text-red-300">
                  {errors.estado.message
                    ? errors.estado.message
                    : "Campos incompletos"}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-5 mx-auto">
            <Button color="red" fullWidth onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button color="blue" fullWidth type="submit">
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DatosPerfil;
