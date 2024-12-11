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
import { useReservas } from "../../context/ReservasProvider";
import { AlertColors } from "../Alert";
import { notifySuccess } from "../../libs/funciones";

dayjs.extend(utc);
dayjs.extend(timezone);

export function DialogReservarTurno({ openDialog, setOpenDialog, slotInfo }) {
  const [alert, setAlert] = useState(null);
  const { crearReserva } = useReservas();

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
      handleOpen()
  
      return () => clearTimeout(timer);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Si el mensaje de error ya es un string, simplemente lo asignamos directamente
        const errorMsg =
          typeof error.response.data.errors === "string"
            ? error.response.data.errors // Si es un string, lo usamos directamente
            : Object.values(error.response.data.errors).flat().join(", "); // Si no, seguimos con el proceso habitual

        return setAlert({ message: errorMsg, color: "red" });
      }
      return setAlert({
        message: "Hubo un error al procesar la reserva",
        color: "red",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  const handleOpen = () => setOpenDialog(!openDialog);

  return (
    <>
      <Dialog size="sm" open={openDialog} handler={handleOpen}>
        <DialogHeader className="relative m-0 block p-6">
          {alert && <AlertColors alert={alert} />}
          <Typography variant="h4" color="blue-gray">
            ¿Deseas reservas el turno?
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Al presionar confirmar, se procederá a guardar su reserva con la
            información proporcionada a continuación.
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
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <CalendarIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography color="blue-gray" className="font-semibold">
                  Fecha
                </Typography>
              </TimelineHeader>
              <TimelineBody className="-mt-2 pb-8">
                <Typography color="gray" className="font-normal text-gray-600">
                  {dayjs(slotInfo.start).format("DD-MM-YYYY")}
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <BellIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography color="blue-gray" className="font-semibold">
                  Cancha y turno
                </Typography>
              </TimelineHeader>
              <TimelineBody className="-mt-2 pb-8">
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Cancha :  ${slotInfo.nro_cancha}`}
                </Typography>
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Turno: ${dayjs(slotInfo.start).format(
                    "h:mm:ss A"
                  )} - ${dayjs(slotInfo.end).format("h:mm:ss A")} `}
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <UserCircleIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography color="blue-gray" className="font-semibold">
                  Datos del usuario
                </Typography>
              </TimelineHeader>
              <TimelineBody className="-mt-2">
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Nombre: ${slotInfo.nombre} ${slotInfo.apellido}`}
                </Typography>
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Email: ${slotInfo.email}`}
                </Typography>
                <Typography color="gray" className="font-normal text-gray-600">
                  {`DNI: ${slotInfo.dni ? slotInfo.dni : "-"}`}
                </Typography>
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Celular: ${slotInfo.nro_celular? slotInfo.nro_celular : "-"}`}
                </Typography>
              </TimelineBody>
            </TimelineItem>
          </Timeline>
        </DialogBody>
        <DialogFooter className="flex justify-evenly">
          <Button color="red" variant="text" onClick={handleOpen}>
            <span>Cancelar</span>
          </Button>
          <Button color="green" onClick={handleRealizarReserva}>
            Confirmar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
