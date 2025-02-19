import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useTipoMantenimiento } from "../../../context/TipoMantProvider";
import { notifyError, notifySuccess } from "../../../libs/funciones";

export function DrawerTipoMantenimiento({
  puedeCrearHorario,
  openDrawer,
  setOpenDrawer,
  tipoMantenimientoEditar = false,
  setTipoMantenimientoEditar,
}) {
  const { crearTipoMantenimiento, editarTipoMantenimiento } =
    useTipoMantenimiento();

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
    if (tipoMantenimientoEditar) {
      reset({
        descripcion: tipoMantenimientoEditar.descripcion,
      });
      return;
    }
    reset({
      descripcion: "",
    });
  }, [tipoMantenimientoEditar]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setTipoMantenimientoEditar(null);
    reset({
      descripcion: "",
    });
  };
  const onSubmit = async (data) => {
    try {
      if (tipoMantenimientoEditar) {
        const respuesta = await editarTipoMantenimiento(
          tipoMantenimientoEditar.id,
          data
        );
        setOpenDrawer(false);
        return notifySuccess(
          respuesta?.message || "Tipo de mantenimiento editado exitosamente"
        );
      }

      const respuesta = await crearTipoMantenimiento(data);
      console.log(respuesta);
      notifySuccess(
        respuesta?.message || "Tipo de mantenimiento creado exitosamente"
      );
      return setOpenDrawer(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMsg = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        notifyError(errorMsg);
        return setOpenDrawer(false);
      }
      notifyError(
        error.response.data.message || "Error al crear el tipo de mantenimiento"
      );
      reset({
        descripcion: "",
      });
      return setOpenDrawer(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex justify-end">
        <Button
          // disabled={!puedeCrearHorario}
          color="blue"
          className={"w-1/4 mb-3 "}
          onClick={handleOpenDrawer}
        >
          Crear Tipo de Mantenimiento
        </Button>
      </div>
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        overlayProps={{ className: "z-30 fixed" }}
        className="z-40"
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            {tipoMantenimientoEditar
              ? "Editar tipo mantenimiento"
              : "Crear tipo mantenimiento"}
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
            Descripcion
          </Typography>
          <Input
            type="text"
            label="Ej: reparacion de ..."
            {...register("descripcion", {
              required: true,
            })}
          />
          {errors.descripcion && (
            <span className="text-red-300">
              {errors.descripcion.message
                ? errors.descripcion.message
                : "Campos incompletos"}
            </span>
          )}
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
