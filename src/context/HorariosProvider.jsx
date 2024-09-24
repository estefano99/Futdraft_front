import { useContext, createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import { rutaHorarios } from "../libs/constantes";

const HorariosContext = createContext(undefined);

export const useHorarios = () => {
  const context = useContext(HorariosContext);
  if (!context) {
    throw new Error(
      "useHorarios debe estar dentro del proveedor HorariosContext"
    );
  }
  return context;
};

const HorariosProvider = ({ children }) => {
  const [horarios, setHorarios] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const listadoHorarios = async (page, setTotalPages) => {
    try {
      const respuestaAxios = await clienteAxios.get(`${rutaHorarios}?page=${page}`);
      console.log(respuestaAxios)
      setHorarios(respuestaAxios.data.horarios);
      setTotalPages(respuestaAxios.data.meta.last_page);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const listadoHorario = async (id, fecha) => {
    try {
      const respuestaAxios = await clienteAxios.get(`${rutaHorarios}/${id}/${fecha}`);
      return respuestaAxios.data;
    } catch (error) {
      throw error;
    }
  }

  // useEffect(() => {
  //   listadoHorarios(currentPage);
  // }, [currentPage]);

  const crearHorario = async (horario) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaHorarios, horario);
      setHorarios((prevHorarios) => [
        ...prevHorarios,
        respuestaAxios.data.horario,
      ]);
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarHorario = async (id, horario) => {
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaHorarios}/${id}`,
        horario
      );
      const horariosActualizados = horarios.map((horario) =>
        horario.id === id ? respuestaAxios.data.horario : horario
    );
      setHorarios(horariosActualizados);
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <HorariosContext.Provider value={{ horarios, crearHorario, editarHorario, listadoHorarios, listadoHorario }}>
      {children}
    </HorariosContext.Provider>
  );
};

export default HorariosProvider;
