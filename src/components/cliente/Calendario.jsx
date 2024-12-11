import React, { useState, useCallback, useEffect } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useHorarios } from "../../context/HorariosProvider";
import { useAuth } from "../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import {
  convertTimeToMinutes,
  notifyError,
  notifyInfo,
} from "../../libs/funciones";
import { DialogReservarTurno } from "./DialogReservarTurno";
import { DialogInformativo } from "./DialogInformativo";
import { useReservas } from "../../context/ReservasProvider";
import ModalEditarReserva from "./ModalEditarReserva";
import { eventPropGetter, getRange, transformarHorario } from "../../libs/calendarioUtils";

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

const Calendario = (props) => {
  const [view, setView] = useState(Views.MONTH); // Estado para manejar la vista del calendario
  const [selectedDate, setSelectedDate] = useState(null); // Estado para manejar la fecha seleccionada
  const [horario, setHorario] = useState(null); // Estado para manejar la fecha seleccionada
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogInfo, setOpenDialogInfo] = useState(false); // Dialog cuando se selecciona un dia que aun no tiene un horario creado
  const [slotInfo, setSlotInfo] = useState(null); //Contiene start y end al seleccionar un slot (Fechas) y los datos del usuario, cancha.
  const [actualizarEvento, setActualizarEvento] = useState(null);
  const [modal, setModal] = useState(false);
  const [fechasConHorarios, setFechasConHorarios] = useState([]); // Colorea los dias en el MONTH para saber cuales estan habilitados

  const { listadoHorario, listadoFechasConHorario } = useHorarios();
  const { reservas, listadoReservas } = useReservas();
  const { user } = useAuth();
  const { id, nro_cancha, precio } = useParams(); //Id de la cancha

  const cancha_id = id;
  const cancha_nro_cancha = nro_cancha;
  const cancha_precio = precio;

  // Maneja la selección de un día en la vista mensual
  const handleDrillDown = async (date, view) => {
    setSelectedDate(date);
    setView(view);
    
    try {
      const dia = dayjs(date).format("YYYY-MM-DD");
      const respuesta = await listadoHorario(cancha_id, dia);

      // Convierte a minutos en formato ej: 60 la duracion_turno para el step, date iso para apertura y cierre
      const horarioModificado = transformarHorario(respuesta.horario)
      setHorario(horarioModificado);
    } catch (error) {
      console.log(error);
      setHorario(null);
      setView(Views.MONTH);
      setOpenDialogInfo(true);
    }
  };

  const handleSelectEvent = (event) => {
    if (event.usuario_id != user?.id) return; //Si el event(turno) no es del usuario retorna
    setActualizarEvento(event);
    notifyInfo(`Si clickeas otro turno, se editará ${event.fecha}`);
  };

  const onSelectSlot = useCallback(
    (slot) => {
      if (view !== Views.DAY) return;

      // Si hay un evento seleccionado para actualizar, llama a update y no a crear un evento
      if (actualizarEvento) {
        setActualizarEvento((prevEvento) => ({
          ...prevEvento,
          start: dayjs(slot.start).format("YYYY-MM-DD HH:mm:ss"),
          end: dayjs(slot.end).format("YYYY-MM-DD HH:mm:ss"),
        }));
        setModal(true);
        return;
      }

      // Crear nueva reserva
      const dataReserva = {
        usuario_id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        dni: user.dni,
        nro_celular: user.nro_celular,
        email: user.email,
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
          setOpenDialogInfo(true); // Muestra el mensaje de error
          return; // Detiene la ejecución aquí
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
        setView(Views.MONTH); // Retorna a la vista mensual
        setOpenDialogInfo(true); // Muestra el mensaje de error
      }
    } else if (start && end && cancha_id) {
      try {
        await listadoReservas(start, end, cancha_id); // Carga las reservas del nuevo rango de fechas
      } catch (error) {
        console.log("Error al cargar las reservas:", error);
      }
    }
  };

  // Si la vista es agenda : Filtrar los eventos para la agenda en base al usuario y que no muestre todos los del renderizado del calendario. Sino muestra todas las RESERVAS
  const filteredEvents = useMemo(() => {
    if (view === Views.AGENDA) {
      return reservas.filter((event) => event.usuario_id === user?.id);
    }
    return reservas; // Retorna todas las reservas para otras vistas
  }, [reservas, view, user?.id]);

  useEffect(() => {
    if (user && user?.id && cancha_id) {
      const { start, end } = getRange(view, new Date());
      if (start && end && cancha_id) {
        listadoReservas(start, end, cancha_id); //Traer todas las reservas.
      }
    }
  }, [user, cancha_id]);

  //Se usa para colorear los dias en el MONTH del calendario para saber cuales tienen creados horarios.
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
        <ModalEditarReserva
          actualizarEvento={actualizarEvento}
          setActualizarEvento={setActualizarEvento}
          modal={modal}
          setModal={setModal}
        />
      )}
      <Calendar
        selectable
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        view={view} // Configura la vista del calendario
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
        views={["month", "day", "agenda"]} // Solo habilita las vistas "month" y "day"
      />
      {openDialog && (
        <DialogReservarTurno
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          slotInfo={slotInfo}
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

export default Calendario;
