import React, { useState, useCallback } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useHorarios } from "../../context/HorariosProvider";
import { useAuth } from "../../context/AuthProvider";
import { useParams } from "react-router-dom";

import { convertTimeToMinutes } from "../../libs/funciones";
import { DialogReservarTurno } from "./DialogReservarTurno";
import { DialogInformativo } from "./DialogInformativo";
import { useReservas } from "../../context/ReservasProvider";

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

  const { listadoHorario } = useHorarios();
  const { reservas } = useReservas();
  const { user } = useAuth();
  const { id : cancha_id, nro_cancha : cancha_nro_cancha, precio : cancha_precio } = useParams(); //Id de la cancha

  // Maneja la selección de un día en la vista mensual
  const handleDrillDown = async (date, view) => {
    console.log(date)
    setSelectedDate(date);
    setView(view);

    if (!date) return console.log("Error en la fecha seleccionada");

    try {
      const dia = dayjs(date).format("YYYY-MM-DD");
      const respuesta = await listadoHorario(cancha_id, dia);

      const { duracion_turno, horario_apertura, horario_cierre, fecha } =
        respuesta.horario;

      // Convierte a minutos en formato ej: 60 la duracion_turno para el step, date iso para apertura y cierre
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
      setHorario(null);
      setView(Views.MONTH);
      setOpenDialogInfo(true);
    }
  };

  const onSelectSlot = useCallback((slot) => {
    if (view !== Views.DAY) return; // Solo ejecuta si estás en la vista 'day'

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
  }, [user, cancha_id, cancha_nro_cancha, cancha_precio, view]);

  return (
    <div className="mx-auto h-[95%] w-[95%]">
      <Calendar
        selectable
        localizer={localizer}
        events={reservas || []}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        view={view} // Configura la vista del calendario
        onView={(newView) => setView(newView)} // Permite cambiar entre vistas
        date={selectedDate ? new Date(selectedDate) : new Date()} // Configura la fecha seleccionada
        onNavigate={(date) => setSelectedDate(date)}
        onDrillDown={handleDrillDown}
        step={horario?.duracion_turno ? horario?.duracion_turno : 60}
        min={horario?.horario_apertura}
        max={horario?.horario_cierre}
        onSelectSlot={onSelectSlot}
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
