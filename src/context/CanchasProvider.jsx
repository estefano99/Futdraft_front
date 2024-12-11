import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaCanchas } from "../libs/constantes";

const CanchasContext = createContext(undefined);

export const useCanchas = () => {
  const context = useContext(CanchasContext);
  if (!context) {
    throw new Error(
      "useCanchas debe estar dentro del proveedor CanchasContext"
    );
  }
  return context;
};

const CanchasProvider = ({ children }) => {
  const [canchas, setCanchas] = useState([]);

  const listadoCanchas = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(rutaCanchas);
      setCanchas(respuestaAxios.data.canchas);
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    listadoCanchas();
  }, []);

  const crearCancha = async (cancha) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaCanchas, cancha);
      console.log(respuestaAxios);
      setCanchas((prevCanchas) => [...prevCanchas, respuestaAxios.data.cancha]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarCancha = async (id, cancha) => {
    console.log(id, cancha);
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaCanchas}/${id}`,
        cancha
      );
      const canchasActualizadas = canchas.map((cancha) =>
        cancha.id === id ? respuestaAxios.data.cancha : cancha
      );
      setCanchas(canchasActualizadas);
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarCancha = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(`${rutaCanchas}/${id}`);
      const canchasActualizadas = canchas.filter(
        (cancha) => cancha.id !== id
      );
      setCanchas(canchasActualizadas);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <CanchasContext.Provider
      value={{ canchas, crearCancha, editarCancha, eliminarCancha }}
    >
      {children}
    </CanchasContext.Provider>
  );
};

export default CanchasProvider;
