import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaTiposMantenimientoBack } from "../libs/constantes";

const TipoMantenimientoContext = createContext(undefined);

export const useTipoMantenimiento = () => {
  const context = useContext(TipoMantenimientoContext);
  if (!context) {
    throw new Error(
      "useTipoMantenimiento debe estar dentro del proveedor TipoMantenimientoContext"
    );
  }
  return context;
};

const TipoMantenimientoProvider = ({ children }) => {
  const [tiposMantenimiento, setTiposMantenimiento] = useState([]);

  const listadoTipoMantenimientos = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(rutaTiposMantenimientoBack);

      if (respuestaAxios.data.tiposMantenimiento.length > 0) {
        setTiposMantenimiento(respuestaAxios.data.tiposMantenimiento);
        // setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setTiposMantenimiento([]);
        // setTotalPages(0);
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTiposMantenimiento([]);
        // setTotalPages(0);
        throw error;
      } else {
        setTiposMantenimiento([]);
        throw error;
      }
    }
  };

  const crearTipoMantenimiento = async (tipoMantenimiento) => {
    try {
      const respuestaAxios = await clienteAxios.post(
        rutaTiposMantenimientoBack,
        tipoMantenimiento
      );
      console.log(respuestaAxios);
      setTiposMantenimiento((prevTipoMant) => [
        ...prevTipoMant,
        respuestaAxios.data.tipoMantenimiento,
      ]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarTipoMantenimiento = async (id, tipoMantenimiento) => {
    console.log(id, tipoMantenimiento);
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaTiposMantenimientoBack}/${id}`,
        tipoMantenimiento
      );
      const tipoMantenimientosActualizados = tiposMantenimiento.map(
        (tipoMantenimiento) =>
          tipoMantenimiento.id === id
            ? respuestaAxios.data.tipoMantenimiento
            : tipoMantenimiento
      );
      setTiposMantenimiento(tipoMantenimientosActualizados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarTipoMantenimiento = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(
        `${rutaTiposMantenimientoBack}/${id}`
      );
      const tipoMantFiltrados = tiposMantenimiento.filter(
        (tipo) => tipo.id !== id
      );
      setTiposMantenimiento(tipoMantFiltrados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <TipoMantenimientoContext.Provider
      value={{
        tiposMantenimiento,
        listadoTipoMantenimientos,
        crearTipoMantenimiento,
        editarTipoMantenimiento,
        eliminarTipoMantenimiento,
      }}
    >
      {children}
    </TipoMantenimientoContext.Provider>
  );
};

export default TipoMantenimientoProvider;
