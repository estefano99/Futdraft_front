import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaTareasBack } from "../libs/constantes";

const TareasContext = createContext(undefined);

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe estar dentro del proveedor TareasContext");
  }
  return context;
};

const TareasProvider = ({ children }) => {
  const [tareas, setTareas] = useState([]);

  const listadoTareas = async (
    page,
    setTotalPages,
    debounceDescripcion,
    debounceFecha,
    debounceMantenimiento
  ) => {
    console.log(debounceMantenimiento)
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaTareasBack}?page=${page}&descripcion=${debounceDescripcion}&fecha=${debounceFecha}&mantenimiento=${debounceMantenimiento}`
      );
      if (respuestaAxios.data.tareas.length > 0) {
        setTareas(respuestaAxios.data.tareas);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setTareas([]);
        setTotalPages(0);
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTareas([]);
        setTotalPages(0);
        throw error;
      } else {
        setTareas([]);
        throw error;
      }
    }
  };

  const crearTarea = async (tarea) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaTareasBack, tarea);
      console.log(respuestaAxios);
      setTareas((prevTareas) => [...prevTareas, respuestaAxios.data.tarea]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarTarea = async (id, tarea) => {
    console.log(id, tarea);
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaTareasBack}/${id}`,
        tarea
      );
      const tareasActualizadas = tareas.map((tarea) =>
        tarea.id === id ? respuestaAxios.data.tarea : tarea
      );
      setTareas(tareasActualizadas);
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarTarea = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(
        `${rutaTareasBack}/${id}`
      );
      const tareasFiltradas = tareas.filter((tarea) => tarea.id !== id);
      setTareas(tareasFiltradas);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        listadoTareas,
        crearTarea,
        editarTarea,
        eliminarTarea,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};

export default TareasProvider;
