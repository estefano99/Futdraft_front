import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  BellIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useAuth } from "../../../context/AuthProvider";
import { useReservas } from "../../../context/ReservasProvider";
import Select from "react-select";

dayjs.extend(utc);
dayjs.extend(timezone);

export function DialogReservarTurnoAdmin({
  openDialog,
  setOpenDialog,
  slotInfo,
  setSlotInfo,
}) {
  const { crearReserva } = useReservas();
  const { usuarios, setUsuarios, listadoUsuariosSinPaginacion } = useAuth();
  const [options, setOptions] = useState([]);

  const handleRealizarReserva = async () => {
    const dataReserva = {
      //Formateo la data a como iria en la base de datos
      precio: slotInfo.precio,
      fecha: dayjs(slotInfo.start).format("YYYY-MM-DD HH:mm:ss"),
      cancha_id: slotInfo.cancha_id,
      usuario_id: slotInfo.usuario_id,
    };
    try {
      const respuesta = await crearReserva(dataReserva);
      notifySuccess(respuesta.message);
      handleOpen();

      return () => clearTimeout(timer);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Si el mensaje de error ya es un string, simplemente lo asignamos directamente
        const errorMsg =
          typeof error.response.data.errors === "string"
            ? error.response.data.errors // Si es un string, lo usamos directamente
            : Object.values(error.response.data.errors).flat().join(", "); // Si no, seguimos con el proceso habitual

        return notifyError(errorMsg);
      }
      return notifyError(error || "Error desconocido");
    }
  };

  const handleOpen = () => setOpenDialog(!openDialog);

  //Change del select, se le asigna el valor del user al slot para mostrar en HTML y mandar al back
  const handleChange = (selectedOption) => {
    // Actualiza slotInfo usando el setter
    setSlotInfo((prev) => ({
      ...prev,
      usuario_id: selectedOption.value,
      nombre: selectedOption.label,
    }));
  };

  const obtenerUsuarios = async () => {
    try {
      const usuarios = await listadoUsuariosSinPaginacion();
      setUsuarios(usuarios);
      const optionsFormateado = usuarios.map((usuario) => ({
        value: usuario.id,
        label: `${usuario.nombre} ${usuario.apellido}`,
      }));
      setOptions(optionsFormateado);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <>
      <Dialog size="sm" open={openDialog} handler={handleOpen}>
        <DialogHeader className="relative m-0 block p-6">
          <Typography variant="h4" color="blue-gray">
            Selecciona el usuario al que deseas reservarle el turno
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="mx-4 -mt-4">
          <Timeline>
            <Select
              placeholder="Selecciona un usuario"
              className="pb-5"
              onChange={handleChange}
              options={options}
            />
            {slotInfo.usuario_id && (
              <>
                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon className="p-2 z-0">
                      <CalendarIcon className="h-4 w-4" />
                    </TimelineIcon>
                    <Typography color="blue-gray" className="font-semibold">
                      Fecha
                    </Typography>
                  </TimelineHeader>
                  <TimelineBody className="-mt-2 pb-8 z-0">
                    <Typography
                      color="gray"
                      className="font-normal text-gray-600"
                    >
                      {dayjs(slotInfo.start).format("DD-MM-YYYY")}
                    </Typography>
                  </TimelineBody>
                </TimelineItem>
                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon className="p-2 z-0">
                      <BellIcon className="h-4 w-4" />
                    </TimelineIcon>
                    <Typography color="blue-gray" className="font-semibold">
                      Cancha y turno
                    </Typography>
                  </TimelineHeader>
                  <TimelineBody className="-mt-2 pb-8">
                    <Typography
                      color="gray"
                      className="font-normal text-gray-600"
                    >
                      {`Cancha :  ${slotInfo.nro_cancha}`}
                    </Typography>
                    <Typography
                      color="gray"
                      className="font-normal text-gray-600"
                    >
                      {`Turno: ${dayjs(slotInfo.start).format(
                        "h:mm:ss A"
                      )} - ${dayjs(slotInfo.end).format("h:mm:ss A")} `}
                    </Typography>
                  </TimelineBody>
                </TimelineItem>
                <TimelineItem>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon className="p-2 z-0">
                      <UserCircleIcon className="h-4 w-4" />
                    </TimelineIcon>
                    <Typography color="blue-gray" className="font-semibold">
                      Datos del usuario
                    </Typography>
                  </TimelineHeader>
                  <TimelineBody className="-mt-2">
                    <Typography
                      color="gray"
                      className="font-normal text-gray-600"
                    >
                      {slotInfo.nombre ? `Nombre: ${slotInfo.nombre}` : "-"}
                    </Typography>
                  </TimelineBody>
                </TimelineItem>
              </>
            )}
          </Timeline>
        </DialogBody>
        <DialogFooter className="flex justify-evenly">
          <Button color="red" variant="text" onClick={handleOpen}>
            <span>Cancelar</span>
          </Button>
          <Button
            color="green"
            disabled={!slotInfo.nombre}
            onClick={handleRealizarReserva}
          >
            {slotInfo.nombre ? "Confirmar" : "Selecciona un usuario"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
