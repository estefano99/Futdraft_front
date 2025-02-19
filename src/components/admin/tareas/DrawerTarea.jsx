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
import { SelectEmpleado } from "../mantenimientos/SelectEmpleado";
import dayjs from "dayjs";
import DateTimePicker from "../mantenimientos/DateTimePicker";
import { useTareas } from "../../../context/TareasProvider";
import { useAuth } from "../../../context/AuthProvider";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { SelectMantenimiento } from "./SelectMantenimiento";

export function DrawerTarea({
  openDrawer,
  setOpenDrawer,
  tareaEditar = null,
  setTareaEditar,
}) {
  const { crearTarea, editarTarea } = useTareas();
  const { accionesUsuarioDisponibles } = useAuth();
  const [puedeCrearTarea, setPuedeCrearTarea] = useState(false);
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
        descripcion: data.descripcion,
        empleado_id: data.empleado_id,
        mantenimiento_id: data.mantenimiento_id,
        fecha_asignacion: data.fecha_asignacion
          ? dayjs(data.fecha_asignacion).format("YYYY-MM-DD HH:mm:ss")
          : "",
        fecha_completado: data.fecha_completado
          ? dayjs(data.fecha_completado).format("YYYY-MM-DD HH:mm:ss")
          : "",
      };

      if (tareaEditar) {
        const respuesta = await editarTarea(tareaEditar.id, dataFormateada);
        setOpenDrawer(false);
        return notifySuccess(respuesta.data.message);
      }
      const respuesta = await crearTarea(dataFormateada);
      notifySuccess(respuesta?.data?.message || "Tarea creada exitosamente");
      reset({
        descripcion: "",
        empleado_id: "",
        mantenimiento_id: "",
        fecha_asignacion: "",
        fecha_completado: "",
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
          "Error al crear la tarea"
      );
      reset({
        descripcion: "",
        empleado_id: "",
        mantenimiento_id: "",
        fecha_asignacion: "",
        fecha_completado: "",
      });
      return setOpenDrawer(false);
    }
  };

  useEffect(() => {
    //Si esta editando
    if (tareaEditar) {
      reset({
        descripcion: tareaEditar.descripcion,
        empleado_id: String(tareaEditar.empleado.id),
        mantenimiento_id: String(tareaEditar.mantenimiento.id),
        fecha_asignacion: tareaEditar.fecha_asignacion,
        fecha_completado: tareaEditar.fecha_completado,
      });
      return;
    }
    reset({
      descripcion: "",
      empleado_id: "",
      mantenimiento_id: "",
      fecha_asignacion: "",
      fecha_completado: "",
    });
  }, [tareaEditar]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setTareaEditar(null);
    reset({
      descripcion: "",
      empleado_id: "",
      mantenimiento_id: "",
      fecha_asignacion: "",
      fecha_completado: "",
    });
  };

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeCrearTarea = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.CREAR_TAREA
    );

    // Actualizar los estados
    setPuedeCrearTarea(puedeCrearTarea);
  }, [accionesUsuarioDisponibles]);

  return (
    <>
      <div className="w-full h-full flex justify-end">
        <Button
          disabled={!puedeCrearTarea}
          color="blue"
          className={"w-1/4 mb-3 "}
          onClick={handleOpenDrawer}
        >
          Crear Tarea
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
            {tareaEditar ? "Editar tarea" : "Crear tarea"}
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
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Empleado
          </Typography>
          <Controller
            name="empleado_id"
            control={control}
            defaultValue=""
            rules={{ required: "El empleado es requerido" }}
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
            Mantenimiento
          </Typography>
          <Controller
            name="mantenimiento_id"
            control={control}
            defaultValue=""
            rules={{ required: "El mantenimiento es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <SelectMantenimiento
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
            fecha asignacion
          </Typography>
          <Controller
            name="fecha_asignacion"
            control={control}
            defaultValue=""
            rules={{ required: "La fecha asignacion es requerida" }}
            render={({ field }) => (
              <DateTimePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha_asignacion && (
            <span className="text-red-500">
              {errors.fecha_asignacion.message}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Fecha completado
          </Typography>
          <Controller
            name="fecha_completado"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <DateTimePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha_completado && (
            <span className="text-red-500">
              {errors.fecha_completado.message}
            </span>
          )}
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
