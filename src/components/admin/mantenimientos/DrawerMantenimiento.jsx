import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useMantenimiento } from "../../../context/MantenimientosProvider";
import { SelectEmpleado } from "./SelectEmpleado";
import { SelectEstado } from "./SelectEstado";
import dayjs from "dayjs";
import { SelectTipoMant } from "./SelectTipoMant";
import DateTimePicker from "./DateTimePicker";
import { accionesDisponibles, tienePermiso } from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";

export function DrawerMantenimiento({
  openDrawer,
  setOpenDrawer,
  mantenimientoEditar = null,
  setMantenimientoEditar,
}) {
  const { crearMantenimiento, editarMantenimiento } = useMantenimiento();
  const { accionesUsuarioDisponibles } = useAuth();
  const [puedeCrearMantenimiento, setPuedeCrearMantenimiento] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const onSubmit = async (data) => {
    try {
      const dataFormateada = {
        responsable: data.responsable,
        descripcion: data.descripcion,
        fecha: data.fecha
          ? dayjs(data.fecha).format("YYYY-MM-DD HH:mm:ss")
          : "",
        fecha_fin: data.fecha_fin
          ? dayjs(data.fecha_fin).format("YYYY-MM-DD HH:mm:ss")
          : "",
        estado: data.estado,
        tipo_mantenimiento_id: data.tipo_mantenimiento_id ?? null,
      };

      if (mantenimientoEditar) {
        const respuesta = await editarMantenimiento(
          mantenimientoEditar.id,
          dataFormateada
        );
        setOpenDrawer(false);
        return notifySuccess(
          respuesta?.message || "Mantenimiento editado exitosamente"
        );
      }
      const respuesta = await crearMantenimiento(dataFormateada);
      notifySuccess(respuesta?.message || "Mantenimiento creado exitosamente");
      reset({
        responsable: "",
        descripcion: "",
        fecha: "",
        fecha_fin: "",
        estado: "",
        tipo_mantenimiento_id: "",
      });
      return setOpenDrawer(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMsg = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        notifyError(errorMsg);
        return setOpenDrawer(false);
      }
      notifyError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al crear mantenimiento"
      );
      reset({
        responsable: "",
        descripcion: "",
        fecha: "",
        fecha_fin: "",
        estado: "",
        tipo_mantenimiento_id: "",
      });
      return setOpenDrawer(false);
    }
  };

  useEffect(() => {
    //Si esta editando
    if (mantenimientoEditar) {
      reset({
        responsable: String(mantenimientoEditar.responsable.id),
        descripcion: mantenimientoEditar.descripcion,
        fecha: mantenimientoEditar.fecha,
        fecha_fin: mantenimientoEditar.fecha_fin,
        estado: mantenimientoEditar.estado,
        tipo_mantenimiento_id: String(
          mantenimientoEditar.tipo_mantenimiento.id ?? null
        ),
      });
      return;
    }
    reset({
      responsable: "",
      descripcion: "",
      fecha: "",
      fecha_fin: "",
      estado: "",
    });
  }, [mantenimientoEditar]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setMantenimientoEditar(null);
    reset({
      responsable: "",
      descripcion: "",
      fecha: "",
      fecha_fin: "",
      estado: "",
    });
  };

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeCrear = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.CREAR_MANTENIMIENTO
    );

    // Actualizar los estados
    setPuedeCrearMantenimiento(puedeCrear);
  }, [accionesUsuarioDisponibles]);

  return (
    <>
      <div className="w-full h-full flex justify-end">
        <Button
          disabled={!puedeCrearMantenimiento}
          color="blue"
          className={"w-1/4 mb-3 "}
          onClick={handleOpenDrawer}
        >
          Crear Mantenimiento
        </Button>
      </div>
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        overlayProps={{ className: "z-30 fixed" }}
        className="overflow-y-auto max-h-screen z-40"
        size={500}
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            {mantenimientoEditar
              ? "Editar mantenimiento"
              : "Crear mantenimiento"}
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
            Responsable
          </Typography>
          <Controller
            name="responsable"
            control={control}
            defaultValue=""
            rules={{ required: "Responsable es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <SelectEmpleado
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </>
            )}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Tipo de mantenimiento
          </Typography>
          <Controller
            name="tipo_mantenimiento_id"
            control={control}
            defaultValue=""
            rules={{ required: "El Tipo de mantenimiento es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <SelectTipoMant
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </>
            )}
          />
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
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Fecha
          </Typography>
          <Controller
            name="fecha"
            control={control}
            defaultValue=""
            rules={{ required: "La fecha es requerida" }}
            render={({ field }) => (
              <DateTimePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha && (
            <span className="text-red-500">{errors.fecha.message}</span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Fecha fin
          </Typography>
          <Controller
            name="fecha_fin"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <DateTimePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha_fin && (
            <span className="text-red-500">{errors.fecha_fin.message}</span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Estado
          </Typography>
          <Controller
            name="estado"
            control={control}
            defaultValue=""
            rules={{ required: "El estado es requerido" }}
            render={({ field }) => (
              <SelectEstado value={field.value} onChange={field.onChange} />
            )}
          />
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
