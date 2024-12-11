import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import {
  rutaGrupos,
  rutaListadoAccionesGrupoById,
  rutaModulosAccionesOrganizadas,
} from "../libs/constantes";
import { useAuth } from "./AuthProvider";

const GruposContext = createContext(undefined);

export const useGrupos = () => {
  const context = useContext(GruposContext);
  if (!context) {
    throw new Error("useGrupos debe estar dentro del proveedor GruposContext");
  }
  return context;
};

const GruposProvider = ({ children }) => {
  const [grupos, setGrupos] = useState([]);
  const {obtenerSoloAcciones, user} = useAuth();

  const listadoGrupos = async (
    page,
    setTotalPages,
    estadoSwitch,
    codigo,
    nombre
  ) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaGrupos}?page=${page}&estadoGrupos=${estadoSwitch}&codigo=${codigo}&nombre=${nombre}`
      );
      if (respuestaAxios.data.grupos.length > 0) {
        setGrupos(respuestaAxios.data.grupos);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setGrupos([]);
        setTotalPages(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setGrupos([]);
        setTotalPages(0);
        throw error;
      } else {
        setGrupos([]);
        throw error;
      }
    }
  };

  const listadoGruposSinPaginacion = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaGrupos}/sin-paginacion`
      );
      if (respuestaAxios.data.length > 0) {
        setGrupos(respuestaAxios.data);
      } else {
        setGrupos([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setGrupos([]);
        throw error;
      } else {
        throw error;
      }
    }
  };

  const listadoModulosAccionesOrganizadas = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(
        rutaModulosAccionesOrganizadas
      );
      return respuestaAxios.data.modulos;
    } catch (error) {
      throw error;
    }
  };

  const listadoAccionesGrupoById = async (grupo) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaListadoAccionesGrupoById}/${grupo.id}/acciones`
      );
      return respuestaAxios.data.modulos;
    } catch (error) {
      throw error;
    }
  };

  const crearGrupo = async (grupo) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaGrupos, grupo);
      setGrupos((prevGrupos) => [...prevGrupos, respuestaAxios.data.grupo]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarGrupo = async (id, grupo) => {
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaGrupos}/${id}`,
        grupo
      );
      const gruposActualizados = grupos.map((grupo) =>
        grupo.id === id ? respuestaAxios.data.grupo : grupo
      );
      setGrupos(gruposActualizados);
      obtenerSoloAcciones(user.id);
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarGrupo = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(`${rutaGrupos}/${id}`);
      const gruposActualizados = grupos.filter((grupo) => grupo.id !== id);
      setGrupos(gruposActualizados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <GruposContext.Provider
      value={{
        grupos,
        listadoGrupos,
        crearGrupo,
        editarGrupo,
        eliminarGrupo,
        listadoModulosAccionesOrganizadas,
        listadoAccionesGrupoById,
        listadoGruposSinPaginacion,
      }}
    >
      {children}
    </GruposContext.Provider>
  );
};

export default GruposProvider;
