import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { useCanchas } from "../../../context/CanchasProvider";
import { useHorarios } from "../../../context/HorariosProvider";
import { SelectHorarios } from "./SelectHorarios";
import DatePicker from "./DatePicker";
import { format, parseISO } from "date-fns";
import { InputHorarios } from "./InputHorarios";
import {
  convertTimeToMinutes,
  notifyError,
  validarFormatoTiempo,
} from "../../../libs/funciones";

export function DrawerHorarios({
  puedeCrearHorario,
  setAlert,
  openDrawer,
  setOpenDrawer,
  horarioEditar,
  setHorarioEditar,
}) {
  const { crearHorario, editarHorario } = useHorarios();
  const { canchas } = useCanchas();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  useEffect(() => {
    //Si esta editando
    if (horarioEditar) {
      reset({
        cancha_id: String(horarioEditar.cancha_id),
        fecha: horarioEditar.fecha ? parseISO(horarioEditar.fecha) : "",
        horario_apertura: String(horarioEditar.horario_apertura),
        horario_cierre: String(horarioEditar.horario_cierre),
        duracion_turno: String(horarioEditar.duracion_turno),
      });
      return;
    }
    reset({
      cancha_id: "",
      fecha: "",
      horario_apertura: "",
      horario_cierre: "",
      duracion_turno: "",
    });
  }, [horarioEditar]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setHorarioEditar(null);
    reset({
      cancha_id: "",
      fecha: "",
      horario_apertura: "",
      horario_cierre: "",
      duracion_turno: "",
    });
  };
  const onSubmit = async (data) => {
    // Asegura de que todos los tiempos estén en formato HH:mm:ss
    const horarioApertura = validarFormatoTiempo(data.horario_apertura);
    const horarioCierre = validarFormatoTiempo(data.horario_cierre);
    const duracionTurno = validarFormatoTiempo(data.duracion_turno);

    // Convierte los tiempos a minutos para validación
    const aperturaFormat = convertTimeToMinutes(horarioApertura);
    const cierreFormat = convertTimeToMinutes(horarioCierre);
    const duracionFormat = convertTimeToMinutes(duracionTurno);

    if (aperturaFormat >= cierreFormat) {
      notifyError(
        "Error: El horario de apertura debe ser antes que el cierre."
      );
      return;
    }

    if (duracionFormat > cierreFormat - aperturaFormat) {
      notifyError(
        "Error: La duración del turno no puede exceder el intervalo disponible."
      );
      return;
    }

    // Formateo el tiempo y fecha solo si no viene en el formato correcto
    const horario = {
      ...data,
      fecha: data.fecha ? format(data.fecha, "yyyy-MM-dd") : "",
      horario_apertura: horarioApertura,
      horario_cierre: horarioCierre,
      duracion_turno: duracionTurno,
    };

    try {
      if (horarioEditar) {
        const respuesta = await editarHorario(horarioEditar.id, horario);
        setOpenDrawer(false);
        return setAlert({
          message: respuesta.data.message,
          color: "green",
        });
      }

      const respuesta = await crearHorario(horario);
      setAlert({ message: respuesta.data.message, color: "green" });
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
        message: "Hubo un error al procesar el Horario",
        color: "red",
      });
      return setOpenDrawer(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex justify-end">
        <Button
          disabled={!puedeCrearHorario}
          color="blue"
          className={!puedeCrearHorario ? "w-1/4 mb-3 opacity-50 cursor-not-allowed" : "w-1/4 mb-3 "}
          onClick={handleOpenDrawer}
        >
          Crear Horario
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
            {horarioEditar ? "Editar Horario" : "Crear Horario"}
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
            Nro. cancha
          </Typography>
          <Controller
            name="cancha_id"
            control={control}
            defaultValue=""
            rules={{ required: "Nro. cancha es requerido" }}
            render={({ field }) => (
              <SelectHorarios
                canchas={canchas}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.nro_cancha && (
            <span className="text-red-500">{errors.nro_cancha.message}</span>
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
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha && (
            <span className="text-red-500">{errors.fecha.message}</span>
          )}
          <Controller
            name="horario_apertura"
            control={control}
            defaultValue=""
            rules={{ required: "El horario de apertura es requerido" }}
            render={({ field }) => (
              <InputHorarios
                type="Horario Apertura"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.horario_apertura && (
            <span className="text-red-500">
              {errors.horario_apertura.message}
            </span>
          )}
          <Controller
            name="horario_cierre"
            control={control}
            defaultValue=""
            rules={{ required: "El horario de cierre es requerido" }}
            render={({ field }) => (
              <InputHorarios
                type="Horario Cierre"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.horario_cierre && (
            <span className="text-red-500">
              {errors.horario_cierre.message}
            </span>
          )}
          <Controller
            name="duracion_turno"
            control={control}
            defaultValue=""
            rules={{ required: "Duración del turno es requerido" }}
            render={({ field }) => (
              <InputHorarios
                type="Duración Turno"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.duracion_turno && (
            <span className="text-red-500">
              {errors.duracion_turno.message}
            </span>
          )}
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
