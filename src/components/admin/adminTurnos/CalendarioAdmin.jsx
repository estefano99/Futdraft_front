import React, { useState, useCallback, useEffect } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useHorarios } from "../../../context/HorariosProvider";
import { useAuth } from "../../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import {
  convertTimeToMinutes,
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../../../libs/funciones";
import { DialogReservarTurnoAdmin } from "./DialogReservarTurnoAdmin";
import { useReservas } from "../../../context/ReservasProvider";
import { DialogInformativo } from "../../cliente/DialogInformativo";
import ModalEditarEliminarReserva from "./ModalEditarEliminarReserva";
import { eventPropGetter, getRange, transformarHorario } from "../../../libs/calendarioUtils";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

// Configura la zona horaria por defecto (opcional)
// dayjs.tz.setDefault("America/Argentina/Buenos_Aires");

// Crea el localizer para react-big-calendar
const localizer = dayjsLocalizer(dayjs);

// Define los mensajes en español
const messages = {
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  allDay: "Todo el día",
  week: "Semana",
  work_week: "Semana laboral",
  day: "Día",
  month: "Mes",
  previous: "Anterior",
  next: "Siguiente",
  yesterday: "Ayer",
  tomorrow: "Mañana",
  today: "Hoy",
  agenda: "Agenda",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total) => `+ Ver más (${total})`,
};

const CalendarioAdmin = (props) => {
  const [view, setView] = useState(Views.MONTH); // Estado para manejar la vista del calendario
  const [selectedDate, setSelectedDate] = useState(null); // Estado para manejar la fecha seleccionada
  const [horario, setHorario] = useState(null); // Estado para manejar la fecha seleccionada
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogInfo, setOpenDialogInfo] = useState(false); // Dialog cuando se selecciona un dia que aun no tiene un horario creado
  const [slotInfo, setSlotInfo] = useState(null); //Contiene start y end al seleccionar un slot (Fechas) y los datos del usuario, cancha.
  const [actualizarEvento, setActualizarEvento] = useState(null);
  const [fechasConHorarios, setFechasConHorarios] = useState([]); // Colorea los dias en el MONTH para saber cuales estan habilitados
  const [modal, setModal] = useState(false);

  const { listadoHorario, listadoFechasConHorario } = useHorarios();
  const { reservas, listadoReservasAdmin, editarReserva } = useReservas();
  const { user } = useAuth();
  const { id, nro_cancha, precio } = useParams(); //Id de la cancha

  const cancha_id = id;
  const cancha_nro_cancha = nro_cancha;
  const cancha_precio = precio;

  // Maneja la selección de un día en la vista mensual
  const handleDrillDown = async (date, view) => {
    if (!date) {
      console.log("Error en la fecha seleccionada");
      return;
    }

    try {
      const dia = dayjs(date).format("YYYY-MM-DD");
      const respuesta = await listadoHorario(cancha_id, dia);

      // Solo muestra el mensaje si el usuario intenta seleccionar un día específico sin horario
      if (!respuesta.horario) {
        setOpenDialogInfo(true);
        return;
      }

      const horarioModificado = transformarHorario(respuesta.horario);

      setHorario(horarioModificado);

      setSelectedDate(date);
      setView(view);
    } catch (error) {
      console.log(error);
      setHorario(null);
      setView(Views.MONTH);
      setOpenDialogInfo(true);
    }
  };

  const handleSelectEvent = (event) => {
    const eventFormateado = {
      ...event,
      start: dayjs(event.start).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(event.end).format("YYYY-MM-DD HH:mm:ss"),
    };
    setActualizarEvento(eventFormateado);
    setModal(true);
  };

  const respuestaEditar = async (eventToUpdate) => {
    if (!eventToUpdate) return; // Prevenir errores si no hay un evento seleccionado

    try {
      const respuesta = await editarReserva(eventToUpdate);
      notifySuccess(`${respuesta.message} - ${respuesta.reserva.fecha}`);
      setActualizarEvento(null); // Limpiar el estado después de actualizar
    } catch (error) {
      console.log(error);
      setActualizarEvento(null);
      notifyError(error.message || "Error al editar la reserva");
    }
  };

  const onSelectSlot = useCallback(
    (slot) => {
      if (view !== Views.DAY) return;

      //Si esta en modo edicion
      if (actualizarEvento) {
        const eventFormateado = {
          ...actualizarEvento,
          start: dayjs(slot.start).format("YYYY-MM-DD HH:mm:ss"),
          end: dayjs(slot.end).format("YYYY-MM-DD HH:mm:ss"),
        };
        setActualizarEvento(eventFormateado);
        respuestaEditar(eventFormateado); //Manda al context a editar
        return;
      }

      // Crear nueva reserva
      const dataReserva = {
        usuario_id: null,
        nombre: null,
        cancha_id: cancha_id,
        nro_cancha: cancha_nro_cancha,
        precio: cancha_precio,
        start: slot.start,
        end: slot.end,
      };

      setSlotInfo(dataReserva);
      setOpenDialog(true);
    },
    [user, cancha_id, cancha_nro_cancha, cancha_precio, view, actualizarEvento]
  );

  //Se ejecuta cuando se selecciona siguiente en el calendario
  const handleNavigate = async (date, view) => {
    setView(view);
    setSelectedDate(date); // Actualiza la fecha seleccionada

    // Calcula el rango de fechas basado en la vista
    const { start, end } = getRange(view, date);

    if (view === Views.DAY) {
      try {
        const dia = dayjs(date).format("YYYY-MM-DD");
        const respuesta = await listadoHorario(cancha_id, dia);

        if (!respuesta.horario) {
          console.log("Horario no habilitado para la fecha seleccionada");
          setHorario(null);
          setView(Views.MONTH); // Retorna a la vista mensual
          setOpenDialogInfo(true); // Muestra el mensaje
          return;
        }

        const { duracion_turno, horario_apertura, horario_cierre, fecha } =
          respuesta.horario;

        const horarioModificado = {
          ...respuesta.horario,
          duracion_turno: convertTimeToMinutes(duracion_turno),
          horario_apertura: horario_apertura
            ? dayjs(`${fecha}T${horario_apertura}`).toDate()
            : null,
          horario_cierre: horario_cierre
            ? dayjs(`${fecha}T${horario_cierre}`).toDate()
            : null,
        };

        setHorario(horarioModificado);
      } catch (error) {
        console.log(error);
        setHorario(null);
        setView(Views.MONTH);
        setOpenDialogInfo(true);
      }
    } else if (start && end && cancha_id) {
      listadoReservasAdmin(start, end, cancha_id); // Carga las reservas del nuevo rango de fechas
    }
  };

  useEffect(() => {
    if (cancha_id) {
      const { start, end } = getRange(view, new Date());
      if (start && end && cancha_id) {
        listadoReservasAdmin(start, end, cancha_id); //Traer todas las reservas.
      }
    }
  }, [cancha_id, user?.id]);

  //Se usa para colorear los dias en el MONTH del calendario para saber cuales tienen creadas horarios.
  const respuestaVistaMes = async () => {
    try {
      const respuesta = await listadoFechasConHorario(cancha_id);
      setFechasConHorarios(respuesta);
    } catch (error) {
      notifyError(error.message || "Error al obtener las fechas con horarios.");
    }
  };

  // Función para personalizar el estilo de los día
  const dayPropGetter = (date) => {
    const isHabilitado = fechasConHorarios.some((fecha) =>
      dayjs(fecha).isSame(dayjs(date), "day")
    );
    return {
      style: {
        backgroundColor: isHabilitado ? "#c8e6c9" : "white", // Verde claro si está habilitado
        color: isHabilitado ? "#1b5e20" : "black", // Texto verde oscuro si está habilitado
      },
    };
  };

  useEffect(() => {
    respuestaVistaMes();
  }, [cancha_id, listadoFechasConHorario]);

  return (
    <div className="mx-auto h-[95%] w-[95%]">
      {modal && (
        <ModalEditarEliminarReserva
          actualizarEvento={actualizarEvento}
          setActualizarEvento={setActualizarEvento}
          modal={modal}
          setModal={setModal}
        />
      )}
      <Calendar
        selectable
        localizer={localizer}
        events={reservas}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        view={view} // Configura la vista del calendario
        views={["month", "day", "agenda"]} // Solo habilita las vistas "month" y "day"
        onView={(newView) => setView(newView)} // Permite cambiar entre vistas
        date={selectedDate ? new Date(selectedDate) : new Date()} // Configura la fecha seleccionada
        onNavigate={handleNavigate}
        onDrillDown={handleDrillDown}
        step={horario?.duracion_turno ? horario?.duracion_turno : 60}
        min={horario?.horario_apertura}
        max={horario?.horario_cierre}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventPropGetter} // Agrega el estilo de color personalizado
        onSelectEvent={handleSelectEvent}
        dayPropGetter={dayPropGetter} // Aplica los colores personalizados a los días en Month
      />
      {openDialog && (
        <DialogReservarTurnoAdmin
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          slotInfo={slotInfo}
          setSlotInfo={setSlotInfo}
        />
      )}

      {openDialogInfo && (
        <DialogInformativo
          setOpenDialogInfo={setOpenDialogInfo}
          openDialogInfo={openDialogInfo}
          date={selectedDate}
        />
      )}
    </div>
  );
};

export default CalendarioAdmin;
