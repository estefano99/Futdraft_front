import { useContext, createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import { rutaHorarios, rutaHorariosConFechas } from "../libs/constantes";

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

  const listadoHorarios = async (
    page,
    setTotalPages,
    debounceNroCancha = "",
    debounceFecha = "",
    debounceHoraApertura = "",
    estadoSwitch = false
  ) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaHorarios}?page=${page}&filtrarNroCancha=${debounceNroCancha}&filtrarFecha=${debounceFecha}&filtrarHoraApertura=${debounceHoraApertura}&isFinalizados=${estadoSwitch}`
      );
      if (respuestaAxios.data.horarios.length > 0) {
        setHorarios(respuestaAxios.data.horarios);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setHorarios([]);
        setTotalPages(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHorarios([]);
        setTotalPages(0);
        throw error;
      } else {
        throw error;
      }
    }
  };

  const listadoHorario = async (id, fecha) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaHorarios}/${id}/${fecha}`
      );
      return respuestaAxios.data;
    } catch (error) {
      throw error;
    }
  };

  //Se usa para colorear los dias en el MONTH del calendario para saber cuales tienen creadas horarios.
  const listadoFechasConHorario = async (cancha_id) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaHorariosConFechas}/${cancha_id}`
      );
      return respuestaAxios.data.fechas;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  const crearHorario = async (horario) => {
    console.log(horario);
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

  const eliminarHorario = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(`${rutaHorarios}/${id}`);
      const horariosActualizados = horarios.filter(
        (horario) => horario.id !== id
      );
      setHorarios(horariosActualizados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <HorariosContext.Provider
      value={{
        horarios,
        crearHorario,
        editarHorario,
        listadoHorarios,
        listadoHorario,
        eliminarHorario,
        listadoFechasConHorario
      }}
    >
      {children}
    </HorariosContext.Provider>
  );
};

export default HorariosProvider;
