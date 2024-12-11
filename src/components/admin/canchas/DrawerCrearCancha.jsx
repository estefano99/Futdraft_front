import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useCanchas } from "../../../context/CanchasProvider";
import { useAuth } from "../../../context/AuthProvider";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";

export function DrawerCrearCancha({
  setAlert,
  openDrawer,
  setOpenDrawer,
  canchaEditar,
  setCanchaEditar,
}) {
  const { crearCancha, editarCancha } = useCanchas();
  const { accionesUsuarioDisponibles } = useAuth();

  const puedeCrearCancha = tienePermiso(
    accionesUsuarioDisponibles,
    accionesDisponibles.CREAR_CANCHA
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  useEffect(() => {
    //Si esta editando
    if (canchaEditar) {
      reset({
        nro_cancha: canchaEditar.nro_cancha,
        precio: canchaEditar.precio,
      });
      return;
    }
    reset({
      nro_cancha: "",
      precio: "",
    });
  }, [canchaEditar]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setCanchaEditar(null);
    reset({
      nro_cancha: "",
      precio: "",
    });
  };

  const onSubmit = async (data) => {
    try {
      if (canchaEditar) {
        const respuesta = await editarCancha(canchaEditar.id, data);
        setOpenDrawer(false);
        return setAlert({
          message: respuesta.data.message,
          color: "green",
        });
      }

      await crearCancha({
        nro_cancha: data.nro_cancha,
        precio: data.precio,
      });
      setAlert({ message: "Cancha creada exitosamente!", color: "green" });
      return setOpenDrawer(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMsg = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setAlert({ message: errorMsg, color: "red" });
        return setOpenDrawer(false);
      }
      setAlert({
        message: "Hubo un error al procesar la cancha",
        color: "red",
      });
      return setOpenDrawer(false);
    }
  };

  return (
    <>
      <Button
        color="blue"
        disabled={!puedeCrearCancha}
        className={
          !puedeCrearCancha
            ? "w-full mt-4 md:mt-0 md:w-1/4 opacity-50 cursor-not-allowed"
            : "w-full mt-4 md:mt-0 md:w-1/4"
        }
        onClick={handleOpenDrawer}
      >
        Crear Cancha
      </Button>
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        overlayProps={{ className: " fixed" }}
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            {canchaEditar ? "Editar Cancha" : "Crear Cancha"}
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <form
          className="flex flex-col gap-6 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Número de cancha
          </Typography>
          <Input
            type="number"
            label="Ej: 1"
            {...register("nro_cancha", {
              required: true,
              validate: (value) => !isNaN(value) || "Debe ser un número válido",
            })}
          />
          {errors.nro_cancha && (
            <span className="text-red-300">
              {errors.nro_cancha.message
                ? errors.nro_cancha.message
                : "Campos incompletos"}
            </span>
          )}

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Precio
          </Typography>
          <Input
            type="number"
            label="Ej: 5000"
            {...register("precio", {
              required: true,
              validate: (value) => !isNaN(value) || "Debe ser un número válido",
            })}
          />
          {errors.precio && (
            <span className="text-red-300">
              {errors.precio.message
                ? errors.precio.message
                : "Campos incompletos"}
            </span>
          )}
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
