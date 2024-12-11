import dayjs from "dayjs";
import { convertTimeToMinutes } from "./funciones";

/**
 * Transforma un horario del backend a un formato compatible con el front.
 * @param {Object} horario - Objeto del horario recibido del backend.
 * @returns {Object} - Horario transformado con formato adecuado.
 */
export const transformarHorario = (horario) => {
    if (!horario) return null;

    const { duracion_turno, horario_apertura, horario_cierre, fecha } = horario;

    return {
        ...horario,
        duracion_turno: convertTimeToMinutes(duracion_turno),
        horario_apertura: horario_apertura
            ? dayjs(`${fecha}T${horario_apertura}`).toDate()
            : null,
        horario_cierre: horario_cierre
            ? dayjs(`${fecha}T${horario_cierre}`).toDate()
            : null,
    };
};

export const getRange = (view, date) => {
    let start, end;

    switch (view) {
        case "month":
            start = dayjs(date).startOf("month");
            end = dayjs(date).endOf("month");
            break;
        case "week":
            start = dayjs(date).startOf("week");
            end = dayjs(date).endOf("week");
            break;
        case "day":
            start = dayjs(date).startOf("day");
            end = dayjs(date).endOf("day");
            break;
        default:
            start = dayjs(date).startOf("month");
            end = dayjs(date).endOf("month");
    }

    return { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") };
};

  // Establece el color dependiendo si es del usuario o de otro en el calendario el event(osea la reserva)
export const eventPropGetter = (event) => ({
    style: {
        backgroundColor: event.color || "gray",
    },
});

export const dayPropGetter = (date, fechasConHorarios) => {
    const isHabilitado = fechasConHorarios.some((fecha) =>
        dayjs(fecha).isSame(dayjs(date), "day")
    );
    return {
        style: {
            backgroundColor: isHabilitado ? "#c8e6c9" : "white",
            color: isHabilitado ? "#1b5e20" : "black",
        },
    };
};
