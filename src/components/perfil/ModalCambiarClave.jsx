import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { notifyError, notifySuccess } from "../../libs/funciones";

export default function ModalCambiarClave({ open, setOpen }) {
  const { cambiarClave, user } = useAuth(); // Supongo que existe esta función en tu AuthProvider
  const [cargando, setCargando] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const handleOpen = () => setOpen(!open);

  const onSubmit = async (data) => {
    try {
      setCargando(true);
      const respuesta = await cambiarClave(
        user.id,
        data.claveActual,
        data.nuevaClave,
        data.confirmarClave
      );
      setOpen(false)
      setCargando(false);
      notifySuccess(respuesta.message); // Mensaje de éxito
    } catch (error) {
      setOpen(false)
      setCargando(false);
      notifyError(error); // Mostrar error
    }
  };

  const nuevaClave = watch("nuevaClave");

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Cambiar Clave
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Cambiar Clave</DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  type="password"
                  label="Clave Actual"
                  {...register("claveActual", {
                    required: "La clave actual es requerida",
                  })}
                />
                {errors.claveActual && (
                  <span className="text-red-500 text-sm">
                    {errors.claveActual.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  label="Nueva Clave"
                  {...register("nuevaClave", {
                    required: "La nueva clave es requerida",
                    minLength: {
                      value: 6,
                      message: "La clave debe tener al menos 6 caracteres",
                    },
                  })}
                />
                {errors.nuevaClave && (
                  <span className="text-red-500 text-sm">
                    {errors.nuevaClave.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  label="Confirmar Nueva Clave"
                  {...register("confirmarClave", {
                    required: "Debes confirmar tu nueva clave",
                    validate: (value) =>
                      value === nuevaClave || "Las claves no coinciden",
                  })}
                />
                {errors.confirmarClave && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmarClave.message}
                  </span>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => {
                handleOpen();
                reset();
              }}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              loading={cargando}
              variant="gradient"
              color="green"
            >
              <span>{cargando ? "Cargando..." : "Confirmar"}</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
