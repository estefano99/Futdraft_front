import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaReservas } from "../libs/constantes";
import { useAuth } from "./AuthProvider";

const ReservasContext = createContext(undefined);

export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error(
      "ReservasContext debe estar dentro del proveedor CanchasContext"
    );
  }
  return context;
};

const ReservasProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reservas, setReservas] = useState(null);
  const [errorAuth, setErrorAuth] = useState(null);
  const { user } = useAuth();

  const obtenerReservas = async (usuario_id) => {
    try {
      if (!usuario_id) return;
      const respuestaAxios = await clienteAxios.get(`${rutaReservas}/${usuario_id}`);
      const reservasBack = respuestaAxios.data.reservas;
      if(reservasBack.length > 0){
        const events = reservasBack.map(reserva => {
          return {
            ...reserva,
            title : "Turno reservado",
            start: new Date(reserva.start),
            end: new Date(reserva.end)
          }
        })
        setReservas(events);
      }
      console.log(reservas)
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const crearReserva = async (reserva) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaReservas, reserva);
      console.log(respuestaAxios);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    obtenerReservas(user?.id);
  }, []);

  return (
    <ReservasContext.Provider value={{ crearReserva, reservas }}>
      {children}
    </ReservasContext.Provider>
  );
};

export default ReservasProvider;
