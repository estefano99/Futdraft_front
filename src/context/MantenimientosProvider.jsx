import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import {
  rutaMantenimientosBack,
  rutaMantenimientosSinPaginacionBack,
} from "../libs/constantes";

const MantenimientoContext = createContext(undefined);

export const useMantenimiento = () => {
  const context = useContext(MantenimientoContext);
  if (!context) {
    throw new Error(
      "useMantenimiento debe estar dentro del proveedor MantenimientoContext"
    );
  }
  return context;
};

const MantenimientoProvider = ({ children }) => {
  const [mantenimientos, setMantenimientos] = useState([]);

  const listadoMantenimientos = async (
    page,
    setTotalPages,
    debounceDescripcion,
    debounceFecha,
    debounceEstado
  ) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaMantenimientosBack}?page=${page}&descripcion=${debounceDescripcion}&fecha=${debounceFecha}&estado=${debounceEstado}`
      );

      if (respuestaAxios.data.mantenimientos.length > 0) {
        setMantenimientos(respuestaAxios.data.mantenimientos);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setMantenimientos([]);
        setTotalPages(0);
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMantenimientos([]);
        setTotalPages(0);
        throw error;
      } else {
        setMantenimientos([]);
        throw error;
      }
    }
  };

  const listadoMantenimientosSinPaginacion = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(
        rutaMantenimientosSinPaginacionBack
      );
      return respuestaAxios.data.mantenimientos;
    } catch (error) {
      throw error;
    }
  };

  const crearMantenimiento = async (mantenimiento) => {
    try {
      const respuestaAxios = await clienteAxios.post(
        rutaMantenimientosBack,
        mantenimiento
      );
      console.log(respuestaAxios);
      setMantenimientos((PrevMantenimientos) => [
        ...PrevMantenimientos,
        respuestaAxios.data.mantenimiento,
      ]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarMantenimiento = async (id, mantenimiento) => {
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaMantenimientosBack}/${id}`,
        mantenimiento
      );
      const mantenimientosActualizados = mantenimientos.map((mantenimiento) =>
        mantenimiento.id === id
          ? respuestaAxios.data.mantenimiento
          : mantenimiento
      );
      setMantenimientos(mantenimientosActualizados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarMantenimiento = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(
        `${rutaMantenimientosBack}/${id}`
      );
      const mantFiltrados = mantenimientos.filter(
        (mantenimiento) => mantenimiento.id !== id
      );
      setMantenimientos(mantFiltrados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <MantenimientoContext.Provider
      value={{
        mantenimientos,
        listadoMantenimientos,
        listadoMantenimientosSinPaginacion,
        crearMantenimiento,
        editarMantenimiento,
        eliminarMantenimiento,
      }}
    >
      {children}
    </MantenimientoContext.Provider>
  );
};

export default MantenimientoProvider;
