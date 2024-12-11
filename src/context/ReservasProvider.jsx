import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaAdminReservasBack, rutaReservas } from "../libs/constantes";
import { useAuth } from "./AuthProvider";

const ReservasContext = createContext(undefined);

export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error(
      "ReservasContext debe estar dentro del proveedor ReservasContext"
    );
  }
  return context;
};

const ReservasProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);
  const { user } = useAuth();

  // Función para obtener todos los turnos en un rango de fechas para mostrar en el calendario
  const listadoReservas = async (start, end, cancha_id) => {
    try {
      const respuestaAxios = await clienteAxios.get(rutaReservas, {
        params: { start, end, cancha_id }, // Enviar los parámetros de fecha
      });
      const reservasBack = respuestaAxios.data.reservas;

      if (reservasBack.length > 0) {
        const events = reservasBack.map((reserva) => {
          // Verificar si el turno pertenece al usuario actual
          const isUserReservation = reserva.usuario_id === user?.id;
          return {
            ...reserva,
            title: isUserReservation
              ? "Tu turno reservado"
              : "Turno reservado por otro usuario",
            start: new Date(reserva.start),
            end: new Date(reserva.end),
            color: isUserReservation ? "blue" : "red", // Color azul para el usuario actual, rojo para otros
          };
        });
        setReservas(events); // Establece todos los eventos en el estado
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //Obtiene todas las reservas en base al id del usuario y las que aun no finalizaron
  const obtenerReservasByIdUsuario = async (
    page,
    setTotalPages,
    debounceFecha = "",
    debounceNroCancha = "",
    estadoSwitch = false
  ) => {
    if (!user?.id) return;
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaReservas}/${user.id}?page=${page}&filtrarNroCancha=${debounceNroCancha}&filtrarFecha=${debounceFecha}&isFinalizados=${estadoSwitch}`
      );
      const reservasBack = respuestaAxios.data.reservas;

      if (reservasBack.length > 0) {
        const events = reservasBack.map((reserva) => ({
          ...reserva,
          title: "Turno reservado",
          start: new Date(reserva.start),
          end: new Date(reserva.end),
        }));
        setReservas(events);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setReservas([]);
        setTotalPages(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setReservas([]);
        setTotalPages(0);
        throw error;
      } else {
        throw error;
      }
    }
  };

  const listadoReservasAdmin = async (start, end, cancha_id) => {
    try {
      const respuestaAxios = await clienteAxios.get(rutaAdminReservasBack, {
        params: { start, end, cancha_id },
      });

      const reservasBack = respuestaAxios.data.reservas;

      if (reservasBack.length > 0) {
        const events = reservasBack.map((reserva) => {
          return {
            ...reserva,
            title: `${reserva.usuario_nombre} ${reserva.usuario_apellido} (${reserva.usuario_email})`,
            start: new Date(reserva.start),
            end: new Date(reserva.end),
            color: "green", // Puedes usar otro color para diferenciar los eventos del admin
          };
        });
        setReservas(events); // Actualiza el estado con las reservas del administrador
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //Esta funcion se reutiliza en el componente de calendario y calendarioAdmin dentro del drawer, y crea un turno para el cliente y otro para el administrador
  const crearReserva = async (reserva) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaReservas, reserva);

      const reservaBack = respuestaAxios.data.reserva;
      const soyElUsuario = reservaBack.usuario_id === user?.id;

      const fechasFormateadas = {
        ...reservaBack,
        title: soyElUsuario
          ? "Tu turno reservado"
          : `${reservaBack.usuario_nombre} ${reservaBack.usuario_apellido} (${reservaBack.usuario_email})`,
        color: soyElUsuario ? "blue" : "green",
        start: new Date(reservaBack.start),
        end: new Date(reservaBack.end),
      };
      setReservas((prevReservas) => [...prevReservas, fechasFormateadas]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarReserva = async (reservaActualizada) => {
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaReservas}/${reservaActualizada.id}`,
        reservaActualizada
      );

      const reservaBack = respuestaAxios.data.reserva;
      const soyElUsuario = reservaBack.usuario_id === user?.id;

      const reservaEditada = {
        ...reservaBack,
        title: soyElUsuario
          ? "Tu turno reservado"
          : `${reservaBack.usuario_nombre} ${reservaBack.usuario_apellido} (${reservaBack.usuario_email})`,
        color: soyElUsuario ? "blue" : "green",
        start: new Date(reservaBack.start),
        end: new Date(reservaBack.end),
      };

      // Actualizar las reservas en el estado
      const reservasActualizadas = reservas.map((reserva) =>
        reserva.id === reservaEditada.id ? reservaEditada : reserva
      );

      setReservas(reservasActualizadas);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarReserva = async (id) => {
    try {
      await clienteAxios.delete(`${rutaReservas}/${id}`);
      const reservasActualizadas = reservas.filter(
        (reserva) => reserva.id != id
      );
      setReservas(reservasActualizadas);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <ReservasContext.Provider
      value={{
        crearReserva,
        reservas,
        obtenerReservasByIdUsuario,
        listadoReservas,
        setReservas,
        eliminarReserva,
        editarReserva,
        listadoReservasAdmin,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
};

export default ReservasProvider;
